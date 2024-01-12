const dataJson = require('../models/dataSchema');
const NodeCache = require('node-cache');
const dataCache = new NodeCache({
    stdTTL: 72000
});

exports.datapost = async (req, res) => {
    try {
        const dataArray = req.body;

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ error: "Invalid data format." });
        }

        const insertedData = await dataJson.insertMany(dataArray, { ordered: false });

        res.status(200).json(insertedData);
    } catch (error) {
        console.error("Error inserting documents:", error);

        if (error.code === 11000) {
            return res.status(200).json({ message: "Some IDs already exist in the database." });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};





//   get movies 

exports.getData = async (req, res) => {
    let results;
    if (dataCache.has("data")) {
        results = JSON.parse(dataCache.get("data"));
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 20);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        results = results.slice(startIndex, endIndex);
    } else {
        results = await dataJson.find({});
        dataCache.set("data", JSON.stringify(results));
    }

    return res.json({
        success: true,
        results,
    });
};



// advance filter 


exports.advancedatafilter = async (req, res) => {
    const keyword = req.query.keyword || "";
    const genre = req.query.genre || "";
    const country = req.query.country || "";
    const premiered = req.query.premiered || "";
    const year = req.query.year || "";
    const type = req.query.type || "";
    const status = req.query.status || "";
    const rating = req.query.rating || "";
    const language = req.query.language || "";

    const genreArray = Array.isArray(genre) ? genre : [genre];
    const languageArray = Array.isArray(language) ? language : [language];
    const ratingMin = rating.toString();
    const ratingMax = (parseInt(rating) + 1).toString();

    const query = {
        title: { $regex: keyword, $options: "i" },
        genre: { $in: genreArray.map(g => new RegExp(g, 'i')) },
        country: { $regex: country, $options: "i" },
        premiered: { $regex: premiered, $options: "i" },
        date: { $regex: year, $options: "i" },
        type: { $regex: type, $options: "i" },
        status: { $regex: status, $options: "i" },
        rating: { $gte: ratingMin, $lt: ratingMax },
        language: { $in: languageArray.map(g => new RegExp(g, 'i')) },
    };

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 20);
    const skip = (page - 1) * limit;

    try {
        const results = await dataJson.find(query).skip(skip).limit(limit);
        res.status(200).json({
            success: 200,
            results
        });
    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }
};


// get data by id 


exports.getonedata = async (req, res) => {

    const { id } = req.params;

    try {

        const getOneData = await dataJson.findOne({ id: id })

        res.status(200).json({
            success: true,
            getOneData
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}


// delete user 


exports.deletedata = async (req, res) => {

    const { id } = req.params;

    try {

        const deletedatabyid = await dataJson.findByIdAndDelete({ _id: id })

        res.status(200).json({
            success: true,
            deletedatabyid
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}



// // update data 

exports.updatedata = async (req, res) => {

    const { dataid } = req.params;

    const { id, title, embed_title, sposter, bposter, type, duration, country, episodes, subtitle, dubbed, description, date, genre, status, premiered, language, studios, rating, producers } = req.body;

    try {

        const updatedatabyid = await dataJson.findByIdAndUpdate({ _id: dataid }, {
            id, title, embed_title, sposter, bposter, type, duration, country, episodes, subtitle, dubbed, description, date, genre, status, premiered, language, studios, rating, producers
        }, { new: true })

        await updatedatabyid.save()

        res.status(200).json({
            success: true,
            updatedatabyid
        })

    } catch (error) {
        res.status(400).json(error);
        console.log("Error");
    }

}