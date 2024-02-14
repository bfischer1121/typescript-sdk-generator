### ⚡️ Build an SDK with AI in 5 minutes

This is an SDK generator that, given just an array of endpoint urls, will create a valid OpenAPI spec ([example](/sdks/pokemon/openapi.json)), Node.js SDK client written in TypeScript ([example](/sdks/pokemon/client)), and tests for the client ([example](/sdks/pokemon/client.test.js)).

### Getting Started

- Run `yarn` to install dependencies
- Copy `.env.example` to `.env` and add your OpenAI API key
- Update the `endpoints` array in `src/generator.ts` with URLs of the endpoints you want to work with
- Run `yarn start` to generate the SDK

🎉 **Voila!** You now have a well documented and fully functional OpenAPI spec and SDK client that works with the API.