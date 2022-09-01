module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        safe: true,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
