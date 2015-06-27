# eote-dice-roller

This is a dice roller for use in Google Hangouts for those playing Edge of the Empire or related Fantasy Flight Star Wars games.

*Note that this application has no official connection whatsoever with Fantasy Flight Publishing, Inc. or Lucasfilm, Ltd. It is purely a fan creation intended as a tool for a popular role-playing game and is offered free of charge.*

To use the roller, visit https://cjhooker.github.io/eote-dice-roller-release/hangout-button.html and click on the button to launch the roller in a hangout.

There is a QA version as well, which may have more features, but may also be less stable. It can be launched from https://cjhooker.github.io/eote-dice-roller-qa/hangout-button.html.

## Contributing

You'll need `grunt`. 

The reason for this is that the code as-is won't run. You'll see some stuff in there like `[[BASE_PATH]]`. To run it, you need to build the project via grunt for a particular target.

You do this by running `grunt build:<target>` E.g. `grunt build:local`

Each target will build a runnable copy of the application, in a folder next to the source folder. So, if your source is in `C:\git\my-eote-roller`, the builds will output to `C:\git\eote-hangouts-dice-roller-local` (for example).

There are three targets:

1. **release**: This is the version that will actually run in Hangouts. Paths are hardcoded to https://eote-hangouts-dice-roller-release.googlecode.com/git/ (moving soon to Github). 
2. **qa**: This will also run in Hangouts. Paths hardcoded to https://cjhooker.github.io/eote-dice-roller-qa/. 
3. **local**: This will run on your local machine, by faking all the Google Hangouts API code. Use this for testing most functionality, which doesn't depend specifically on the Hangouts API.

**NOTE**: Right now, **release** and **qa** are not terribly useful to anyone but me, as only I have access to release a new version of the app. You could, however, create your own development Hangouts app with your own URL and create a target for it, and use this to generate the code to run there. I hope to make this smoother by some enhancements to `Gruntfile.js` ([Issue #3](/../../issues/3)).
