const express = require('express');
const http = require("http");
const cors = require('cors');
const convert = require('convert-units')
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }))

app.post('/api/v1/data/conversion',(req,res) => {
    let returnValue = "incorrect"; 
    const input = req.body.input;  
    let inputUnitOfMeasure = req.body.inputUnitOfMeasure;
    let targetUnitOfMeasure = req.body.targetUnitOfMeasure;
    const studentResponse  = req.body.studentResponse;

    let roundedStudentresponse = 0;

    if(validateUOM(inputUnitOfMeasure,targetUnitOfMeasure)){
        inputUnitOfMeasure = convertUOM(inputUnitOfMeasure); 
        targetUnitOfMeasure = convertUOM(targetUnitOfMeasure);   
    } else {
        returnValue = "invalid"
        res.send({
            response:returnValue
        });
    }

    
    const actualConversionValue = convert(input).from(inputUnitOfMeasure).to(targetUnitOfMeasure);
    

    const roundedValue = actualConversionValue.toFixed(1);
    if(studentResponse){
        roundedStudentresponse = parseFloat(studentResponse).toFixed(1);
    }

    if(actualConversionValue && roundedValue==roundedStudentresponse){
        returnValue = "correct"
    }

    res.send({
        response:returnValue
    });
});

function validateUOM (sourceUOM, targetUOM) {
    
    const temperatureUOM = ['Kelvin','Celsius','Fahrenheit','Rankine'];
    const volumeUOM = ['liters','tablespoons','cubic-inches','cups','cubic-feet','gallons'];
    
    if(temperatureUOM.includes(sourceUOM)){
        if(temperatureUOM.includes(targetUOM)){
            return true;
        }
    }else if(volumeUOM.includes(sourceUOM)){
        if(volumeUOM.includes(targetUOM)){
            return true;
        }
    }

    return false;

}

function convertUOM(unitOfMeasure) {
    const convertMap = populateUOMMap();
    const eqUnitOfMeasure = convertMap.get(unitOfMeasure);
    return eqUnitOfMeasure;  

}

function populateUOMMap() {

    const temperatureUOM = ['Kelvin','Celsius','Fahrenheit','Rankine'];
    const volumeUOM = ['liters','tablespoons','cubic-inches','cups','cubic-feet','gallons'];

    const conversionMap = new Map();

    conversionMap.set('Kelvin','K');
    conversionMap.set('Celsius','C');
    conversionMap.set('Fahrenheit','F');
    conversionMap.set('Rankine','R');

    conversionMap.set('liters','l');
    conversionMap.set('tablespoons','tsp');
    conversionMap.set('cubic-inches','in3');
    conversionMap.set('cups','cup');
    conversionMap.set('cubic-feet','ft3');
    conversionMap.set('gallons','gal');

    return conversionMap;

}

app.listen(3000,()=>console.log('Server started on port 3000') );
