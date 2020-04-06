module.exports = {
  packagerConfig: {
    icon:'./img/icon'
  },
  makers: [
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: '1Hack',
        setupExe:'1HackSetup.exe',
        setupIcon:'./img/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
          options: {
              maintainer: 'Ahmed Ayman',
              homepage: 'https://github.com/ahmedayman4a/1Hack',
              icon:'./img/icon.png',
              name:'1hack',
              productName:'1Hack'
            }
      }
    },
    {
      name:'@electron-forge/maker-rpm',
      config: {
          options: {
              maintainer: 'Ahmed Ayman',
              homepage: 'https://github.com/ahmedayman4a/1Hack',
              icon:'./img/icon.png',
              productName:'1Hack'
            }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './img/icon.png',
        name: '1Hack'
      }
    }
  ],
  publishers: [
      {
          name: '@electron-forge/publisher-github',
          config: {
              prerelease: true,
              repository: {
                  owner:'ahmedayman4a',
                  name:'1Hack'
              }
          }
      }
  ]
}