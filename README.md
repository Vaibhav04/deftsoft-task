# deftsoft-task

## Requirements

For development, you will only need Node.js and a node global package.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version


If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g
    

## Install

    $ git clone https://github.com/Vaibhav04/deftsoft-task.git
    $ cd deftsoft-task
    $ npm install

## Configure app

Open `config/index` then edit it with your settings. You will need:

- Email id;
- Password;
- Fronend url of your app (for test purpose you can enter http://localhost:4200)

## Running the project

    $ nodemon index
