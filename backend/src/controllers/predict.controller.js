const axios = require('axios');
const Office = require('../models/office.model');


const predict = async (req, res) => {

    try {

        const { office_id , department, datetime } = req.body; 
        
        if ( !office_id || !department || !datetime ) {
            return res.status(400).json( {
                success: false,
                message: 'office_id, department, and datetime are required'
            });
        }

        const office = await Office.findById(office_id);
        if (!office) {
            return res.status(404).json( {
                success: false,
                message: 'Office not found' 
            });
        }


        const type = office.office_type;
        const city = office.address.city;
        const openHour = office.hours.open;
        const closeHour = office.hours.close;

        const data = {
            office_id: office_id,
            type: type,
            city: city,
            department: department,
            datetime: datetime,
            openHour: openHour,
            closeHour: closeHour
        }

        const response = await axios.post( `${process.env.PREDICTION_SERVICE_URL}/predict`, data );

        if ( response.status === 200 ) {
            return res.status(200).json( {
                success: true,
                predicted_wait_time: response.data.predicted_wait_time
            });
        }

        return res.status(500).json( {
            success: false,
            message: 'Prediction service error'
        });



    }
    catch (error) {
        console.error('ISE > Prediction Hour Failed : ', error);
        res.status(500).json( {
            success: false,
            message: 'Internal Server Error' 
        });
    }
}

const predictDay = async (req, res) => {

    try {

        const { office_id , department, datetime } = req.body; 
        
        if ( !office_id || !department || !datetime ) {
            return res.status(400).json( {
                success: false,
                message: 'office_id, department, and datetime are required'
            });
        }

        const office = await Office.findById(office_id);
        if (!office) {
            return res.status(404).json( {
                success: false,
                message: 'Office not found'
            });
        }


        const type = office.office_type;
        const city = office.address.city;
        const openHour = office.hours.open;
        const closeHour = office.hours.close;

        const data = {
            office_id: office_id,
            type: type,
            city: city,
            department: department,
            datetime: datetime,
            openHour: openHour,
            closeHour: closeHour
        }

        const response = await axios.post( `${process.env.PREDICTION_SERVICE_URL}/predict/day`, data );

        if ( response.status === 200 ) {
            return res.status(200).json( {
                success: true,
                predicted_wait_time: response.data.predicted_wait_time
            });
        }

        return res.status(500).json( {
            success: false,
            message: 'Prediction service error'
        });



    }
    catch (error) {
        console.error('ISE > Prediction Day Failed : ', error);
        res.status(500).json( {
            success: false,
            message: 'ISE > Internal Server Error' + error.message 
        });
    }

}

const predictWeek = async (req, res) => {

    try {

        
        const { office_id , department, datetime } = req.body; 
        
        if ( !office_id || !datetime || open_hour === undefined || close_hour === undefined ) {
            return res.status(400).json( {
                success: false,
                message: 'Missing required parameters'
            });
        }

        const office = await Office.findOne({ office_id });
        if (!office) {
            return res.status(404).json( {
                success: false,
                message: 'Office not found'
            });
        }


        const type = office.office_type;
        const city = office.address.city;
        const openHour = office.hours.open;
        const closeHour = office.hours.close;

        const data = {
            office_id: office_id,
            type: type,
            city: city,
            department: department,
            datetime: datetime,
            openHour: openHour,
            closeHour: closeHour
        }

        const response = await axios.post( `${process.env.PREDICTION_SERVICE_URL}/predict/week`, data );

        if ( response.status === 200 ) {
            return res.status(200).json( {
                success: true,
                predicted_wait_time: response.data.predicted_wait_time
            });
        }

        return res.status(500).json( {
            success: false,
            message: 'ISE > Prediction service error' + response.statusText
        });


    }
    catch (error) {
        console.error('ISE > Prediction Week Failed : ', error);
        res.status(500).json( {
            success: false,
            message: 'Internal Server Error' + error.message 
        });
    }

}

module.exports = {
    predict,
    predictDay,
    predictWeek
}

