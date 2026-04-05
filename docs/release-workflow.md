# Release Workflow

This project uses GitHub Actions to automatically publish to npm when a new version tag is pushed.

## How to Release a New Version

1. **Check your changes**: Ensure everything is committed and tests are passing.
2. **Version the package**: Run the following command (it will also run tests and build locally):
   ```bash
   npm version patch # or minor, or major
   ```
3. **Push the tag**: 
   ```bash
   git push --follow-tags
   ```
4. **Automation**: GitHub Actions will detect the `v*` tag, run the tests, build the project, and publish the `dist` folder to npm.

## NPM Provenance
This package uses **NPM Provenance**, which cryptographically links the published package to its source repository and CI/CD workflow, providing an extra layer of security and transparency for users.
