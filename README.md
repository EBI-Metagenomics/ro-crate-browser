# RO-Crate Browser

A React component for browsing RO-Crate content.

## Installation

Install the package using npm:

```sh
npm install ro-crate-browser
```


## Usage

``````
import React from 'react';
import RoCrateBrowser from 'ro-crate-browser';

const App = () => {
  return (
    <div>
      <h1>RO-Crate Browser Example</h1>
      <RoCrateBrowser crateUrl="path/to/your/ro-crate" useButtonVariant={true} />
    </div>
  );
};

export default App;

``````

## Props

- `crateUrl`: URL to the RO-Crate JSON file.
- `useButtonVariant`: Use button variant for the file and folder links. Default is `false`.

## Development
- dev: Start the development server using Vite
- build: Build the project using TypeScript and Vite
- lint: Run ESLint
- preview: Preview the built project using Vite
