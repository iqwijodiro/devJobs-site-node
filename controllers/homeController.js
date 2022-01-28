exports.showJobs = (req, res) => {
    res.render('home', {
        pageName: 'devJobs',
        tagline: 'Find and post your dreamest job role',
        bar: true,
        button: true
    })
}