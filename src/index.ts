console.log(process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'])
