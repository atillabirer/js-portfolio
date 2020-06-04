module.exports = {
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
    ]
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const gitHubIssueUrl = (repo, query) =>
            `https://github.com/${repo}/issues${
              query ? `?q=is%3Aissue+${query}` : ''
            }`

          const throwInvalidConfigError = ({
            message,
            gitHubIssueQuery: query
          }) => {
            throw new Error(
              `${message}\n\n` +
                'Did you update create-react-app or craco recently? \n' +
                'Please take a look at some recent issues in craco and ' +
                'create-react-app to see if someone has found a solution: \n\n' +
                `* ${gitHubIssueUrl('sharegate/craco', query)}\n` +
                `* ${gitHubIssueUrl('facebook/create-react-app', query)}\n`
            )
          }

          const lessExtension = /\.less$/

          const { getLoader, loaderByName } = require('@craco/craco')
          const { isFound, match: fileLoaderMatch } = getLoader(
            webpackConfig,
            loaderByName('file-loader')
          )
          if (!isFound) {
            throwInvalidConfigError({
              message: "Can't find file-loader in the webpack config!",
              gitHubIssueQuery: 'webpack+file-loader'
            })
          }
          fileLoaderMatch.loader.exclude.push(lessExtension)

          const lessRule = {
            test: lessExtension,
            use: [
              {
                loader: require.resolve('style-loader')
              },
              {
                loader: require.resolve('css-loader')
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  modifyVars: {
                    'font-family':
                      "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol','Noto Color Emoji'",
                    'primary-color': '#4a1faf'
                  },
                  javascriptEnabled: true
                }
              }
            ]
          }

          const oneOfRule = webpackConfig.module.rules.find(
            rule => typeof rule.oneOf !== 'undefined'
          )
          if (!oneOfRule) {
            throwInvalidConfigError({
              message:
                "Can't find a 'oneOf' rule under module.rules in the webpack config!",
              gitHubIssueQuery: 'webpack+rules+oneOf'
            })
          }
          oneOfRule.oneOf.push(lessRule)

          return webpackConfig
        }
      }
    }
  ]
}
