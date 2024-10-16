import { ReactElement, useState } from 'react';

import CSS from 'csstype';

/* styling for the root container */
const rootStyle: CSS.Properties<string, string> = {
  position: 'relative',
  height: '100%',
  width: '100%',
};

const tabsContainerParent: CSS.Properties<string, string> = {
  position: 'absolute',
  left: '0',
  right: '0',
  textAlign: 'center',
  zIndex: 2,
};

/* styling for the topmost bar containing the labels */
const tabsContainerStyle: CSS.Properties<string, string> = {
  backgroundColor: '#e8e1e2',
  border: '1px solid #dcd6d7',
  display: 'inline-block',
  borderRadius: '5px',
  height: '20px',
  margin: '0 auto',
  zIndex: 1,
};

/* style for the active tab */
const tabActiveStyle: CSS.Properties<string, string> = {
  backgroundColor: 'white',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
};

/* remove default button styling from button in tabContainer */
const buttonStyle: CSS.Properties<string, string> = {
  backgroundColor: 'transparent',
  border: 'none',
  height: '20px',
  verticalAlign: 'top',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.8em',
  paddingLeft: '12px',
  paddingRight: '12px',
};

const buttonContainerStyle: CSS.Properties<string, string> = {
  display: 'inline-block',
  verticalAlign: 'top',
};

/* styling for separators in between labels */
const separatorStyle: CSS.Properties<string, string> = {
  height: '14px',
  marginTop: '3px',
  width: '1px',
  backgroundColor: '#d0cacb',
  display: 'inline-block',
};

/* root container for tab bodies */
const bodyContainerStyle: CSS.Properties<string, string> = {
  position: 'relative',
  top: '10px',
  backgroundColor: '#f0ebec',
  border: '1px solid #e2dbdc',
  width: '100%',
  zIndex: 0,
  borderRadius: '5px',
  paddingTop: '8px',
  paddingBottom: '8px',
};

/* ensures body content stays below tabContainer */
const bodyPadStyle: CSS.Properties<string, string> = {
  marginTop: '10px',
};

type PropTypes = {
  tabLabels: string[];
  tabBodies: ReactElement[];
};

export default function OsxTabs(props: PropTypes): JSX.Element {
  const { tabLabels, tabBodies } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (tabLabels.length !== tabBodies.length)
    throw new Error('tabLabels and tabBodies must be the same length!');

  return (
    <div style={rootStyle}>
      <div style={tabsContainerParent}>
        <div style={tabsContainerStyle}>
          {tabLabels.map((lbl, idx) => {
            const bStyle = {};
            Object.assign(bStyle, buttonStyle);
            if (selectedIndex === idx) Object.assign(bStyle, tabActiveStyle);

            return (
              <div key={lbl} style={buttonContainerStyle}>
                <button
                  type="button"
                  style={bStyle}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {lbl}
                </button>
                {idx !== tabLabels.length - 1 ? (
                  <div style={separatorStyle} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div style={bodyContainerStyle}>
        <div style={bodyPadStyle}>{tabBodies[selectedIndex]}</div>
      </div>
    </div>
  );
}
