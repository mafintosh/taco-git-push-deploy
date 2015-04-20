#!/usr/bin/env node

var proc = require('child_process')
var path = require('path')
var edit = require('string-editor')

var onerror = function (err) {
  console.error(err.message || err)
  process.exit(1)
}

if (!process.argv[2]) onerror('Usage: taco-git-push-deploy user@remote-server.com')

try {
  var name = require(path.resolve('./package.json')).name
} catch (err) {
  onerror('No package.json found')
}

var repo = 'taco-git-push-deploy/' + name + '.git'

var script = ''
  + '#!/bin/bash\n'
  + '# setup your taco pipeline\n'
  + '# make sure git, taco-build, taco-mon etc is installed on your server\n\n'
  + 'git archive --format=tar master | taco-build "npm install" | taco-mon deploy ~\n'

proc.exec('git status', function (err) {
  if (err) return onerror('Not a git repository')

  edit(script, 'taco.sh', function (err, str) {
    if (err) return onerror(err)

    var cmd = ''
      + 'mkdir -p ' + repo + ' && cd ' + repo + '; ([ ! -d hooks ] && git init --bare);'
      + 'printf ' + JSON.stringify(str) + ' > hooks/post-receive; chmod +x hooks/post-receive'

    var child = proc.spawn('ssh', [process.argv[2], cmd], {
      stdio: 'inherit'
    })

    child.on('exit', function (code) {
      if (code) return process.exit(code)
      proc.exec('git remote rm deploy; git remote add deploy ' + process.argv[2] + ':' + repo, function () {
        console.log('Taco pipeline created. To deploy simply do:\n\n  git push deploy master\n')
      })
    })
  })
})
