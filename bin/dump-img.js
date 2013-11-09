var img = require('../lib/img');

var url = 'https://d8142femxnlg1.cloudfront.net/cropped-profile-photos/b659be57aa3bbb8905dfff6b142e170113e76d63-s48.jpg';
img.init(url, function(e) {
  if(e) {
    console.error(e);
  }
  process.exit(0);
});
