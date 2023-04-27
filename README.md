<div align="center">
<img width="200px" align="center"  src="https://user-images.githubusercontent.com/13665641/123451792-d5eaf080-d5ab-11eb-90cd-583254c923cb.png" />
  </div>
<h1 align="center">SuperController</h1>
<h3 align="center">Give your MIDI devices super powers (for free, forever).</h3>
<div align="center" style="margin-bottom: 200px;">
  <img src="https://img.shields.io/github/actions/workflow/status/aolsenjazz/super-controller/test.yml"/>
  <img src="https://img.shields.io/github/license/aolsenjazz/super-controller"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"/>
</div>
</br></br>
<img src="https://user-images.githubusercontent.com/13665641/123446702-20b63980-d5a7-11eb-8cd4-b3a4b7c8d5f4.gif" width="100%"/>
</br>

- 🎛️ **100% Customizable**: Override MIDI number, value, channel, and event type
- 🎹 **Share Sustain** Share sustain events between your controllers
- 💡 **Custom Lights** Control color and behaviour of backlights
- ⏩ **Low Latency**: < 1 ms latency

SuperController is an [electron](https://www.electronjs.org/) application boostrapped with [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). Designed with music preformance in mind, SuperController can be used to interact with MIDI clients in ways new and creative ways. Simply plug in devices, add the device to the current project, and take greater control over your devices than ever before.

Basic usage guides can be found at the [SuperController knowledgebase](https://help.supercontroller.net/books/setup).

## Device Support

If a device is supported, it will have a driver file in the drivers folder. Supporting more devices make this software more useful for everyone so if you are able to write drivers for your devices, please do so! If not, please [open a pull request](https://github.com/aolsenjazz/super-controller/pulls) and we'll work together to get your device supported.

## Build + run locally

```shell
git clone https://github.com/aolsenjazz/super-controller
cd super-controller
npm run post-clone
npm start
```

## Tests

After install and running post-clone:

```shell
npm run build
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

License available in `LICENSE.txt`.
