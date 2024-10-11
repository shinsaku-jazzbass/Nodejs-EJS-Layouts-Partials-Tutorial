const express = require("express");
const router = express.Router();

// router.use(express.static('../views'));
//router.use(express.static('../public'));

//server.jsのapp.use("/about",aboutRouter)によりこのabout.jsが/about以降をルーティングする。
//layout.evs上にabout.ejsレンダリング
router.get('/', (req, res) => {
    res.render('about',{
        title: "About Page",
        layout: './layouts/sidebar',
    });
});

router.get("/myprofile", (req, res) => {
    res.render('about',{
        title: "About Myprofile",
        layout: './layouts/sidebar2',
    });
})
router.get("/myjazz", (req, res) => {
    res.render('about',{
        title: "About Myjazz",
        layout: './layouts/sidebar2',
    });
})

router.get("/myfellow", (req, res) => {
    res.render('about',{
        title: "About Myfellow",
        layout: './layouts/sidebar2',
    });
})


module.exports = router;