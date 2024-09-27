// midi_test.cpp

#include <iostream>
#include <chrono>
#include <vector>
#include <string>
#include <cstdlib>
#include "RtMidi.h"

// Function to get input port index by name
int getInputPortIndexByName(RtMidiIn* midiIn, const std::string& name) {
    unsigned int nPorts = midiIn->getPortCount();
    for (unsigned int i = 0; i < nPorts; i++) {
        std::string portName = midiIn->getPortName(i);
        if (portName.find(name) != std::string::npos) {
            return i;
        }
    }
    return -1;
}

// Function to get output port index by name
int getOutputPortIndexByName(RtMidiOut* midiOut, const std::string& name) {
    unsigned int nPorts = midiOut->getPortCount();
    for (unsigned int i = 0; i < nPorts; i++) {
        std::string portName = midiOut->getPortName(i);
        if (portName.find(name) != std::string::npos) {
            return i;
        }
    }
    return -1;
}

int main() {
    std::cout << "Test 5: Receive from Virtual Device -> Send to Virtual Device" << std::endl;

    RtMidiIn* midiIn = nullptr;
    RtMidiOut* midiOut = nullptr;

    try {
        midiIn = new RtMidiIn();
        midiOut = new RtMidiOut();
    } catch (RtMidiError& error) {
        error.printMessage();
        exit(EXIT_FAILURE);
    }

    std::string virtualDeviceName = "APC Key 25"; // Change to your virtual device name

    int inputPortIndex = getInputPortIndexByName(midiIn, virtualDeviceName);
    int outputPortIndex = getOutputPortIndexByName(midiOut, virtualDeviceName);

    if (inputPortIndex == -1 || outputPortIndex == -1) {
        std::cerr << "Required port not found" << std::endl;
        exit(EXIT_FAILURE);
    }

    // Open the ports
    midiIn->openPort(inputPortIndex);
    midiOut->openPort(outputPortIndex);

    // Don't ignore sysex, timing, or active sensing messages
    midiIn->ignoreTypes(false, false, false);

    // Create a timestamp type alias
    using Clock = std::chrono::high_resolution_clock;
    using TimePoint = std::chrono::time_point<Clock>;

    // Create a lambda function to handle MIDI input
    auto midiCallback = [](double deltaTime, std::vector<unsigned char>* message, void* userData) {
        RtMidiOut* midiOut = static_cast<RtMidiOut*>(userData);

        TimePoint receiveTime = Clock::now();

        // Print received message
        std::cout << "Received message: ";
        for (unsigned int i = 0; i < message->size(); i++)
            std::cout << std::hex << (int)(*message)[i] << " ";
        std::cout << std::dec << std::endl;

        // Send the message
        midiOut->sendMessage(message);

        TimePoint sendTime = Clock::now();

        // Calculate elapsed time
        auto elapsedTime = std::chrono::duration_cast<std::chrono::microseconds>(sendTime - receiveTime).count();
        double elapsedTimeMs = elapsedTime / 1000.0;

        std::cout << "Elapsed time between receive and send: " << elapsedTimeMs << " ms" << std::endl;
    };

    // Set the callback function
    midiIn->setCallback(midiCallback, midiOut);

    std::cout << "Listening for MIDI input... Press Ctrl+C to exit." << std::endl;

    // Keep the program running
    while (true) {
        // Sleep for a short duration to reduce CPU usage
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    // Cleanup (this part will not be reached in this example)
    delete midiIn;
    delete midiOut;

    return 0;
}
