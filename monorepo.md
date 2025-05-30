When you run npm install at the root:

npm checks all the directories listed in the workspaces array.
It installs each package’s dependencies, but if a dependency is already installed at the root level (and the version matches), it won’t install it again in the package folder.
Only dependencies that are unique or have different versions will be installed inside the specific package’s node_modules.
In short:
npm installs all needed dependencies for every workspace, but avoids duplication by sharing packages at the root level whenever possible.


Great question!
By default, npm run build only runs the build script in the current directory.

If you run npm run build inside joi-enhancer, it will build only joi-enhancer.
If you run npm run build at the root, nothing will happen unless you define a build script in the root package.json.
How to build all packages from the root?
You can use npm workspaces to run scripts in all workspaces at once:

Add this to your root package.json:

Or, use the npm command directly:

This will run the build script in every workspace package.

Summary:

To build a single package: run npm run build inside that package folder.
To build all packages at once: run npm run build --workspaces at the root (with npm v7+).