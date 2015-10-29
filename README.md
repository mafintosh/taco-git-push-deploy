# taco-git-push-deploy

git push deploy with [taco](https://github.com/maxogden/taco)

```
npm install -g taco-git-push-deploy
```

[![build status](http://img.shields.io/travis/mafintosh/taco-git-push-deploy.svg?style=flat)](http://travis-ci.org/mafintosh/taco-git-push-deploy)

## Usage

First go into your application that you want to deploy using `git push`

```
cd my-app
```

Make sure this app has a package.json that contains a `name` field. Then run

```
# substitute maf@mafintosh.com with an ssh user/host you want to setup deployment to
taco-git-push-deploy maf@mafintosh.com
```

This will open your editor with a file that looks like this one

```
#!/bin/bash
# setup your taco pipeline
# make sure git, taco-build, taco-mon etc is installed on your server

git archive --format=tar master | taco-build "npm install" | taco-mon deploy ~
```

This is the script that will be running on the server when you `git push` to it.
If you wan't to use a different build command than `npm install` etc you should edit it here.

When you save and close this script file in your editor `taco-git-push-deploy` will login to
your server, create a bare git repo, add your script as a `post-receive` hook and and the repo
as a remote called `deploy` in your local repo. If you want to name the remote something else
you can use the `--remote [name]` option.

Now all you need to do to deploy your app is

```
git push deploy master
```

## License

MIT
