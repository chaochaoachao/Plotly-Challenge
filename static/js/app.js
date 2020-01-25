
function initialize(){

  var dropdown = d3.select("#selDataset");


  d3.json("../samples.json").then((data) => {
  //console.log(data);

  //append values to dropdown button
  data.names.forEach(function(name){
    dropdown.append("option").text(name).property("value");})

  var id =data.names[0];

  
  updatePlot(id);
  metadata(id);

  
  
  }
)}


function optionChanged(id){
    updatePlot(id);
    metadata(id);    
}


function updatePlot(id){

    d3.json("../samples.json").then((data) => {
        //console.log(data);

        //filter the sample values by id
        var samples = data.samples.filter(s =>s.id.toString()===id)[0];
       // console.log(samples);

        //get top 10 variables for bar charts
        var sample_values = samples.sample_values.slice(0,10).reverse();
        var otu_top_10 = samples.otu_ids.slice(0,10).reverse()
        var otu_id = otu_top_10.map(d=>"OTU"+d) 
        var labels =samples.otu_labels.slice(0,10);
        // get wf for gauge
        
        //console.log(wf);


        //plot bar chart
        var trace_1 = {
            x: sample_values,
            y: otu_id,
            text:labels,
            type: "bar",
            orientation:"h"
          };

        var data_1 = [trace_1];

        // Define the plot layout
        var layout = {
        title: "Top 10 OTU",};

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", data_1, layout);
      
        //get variables for the bubble chart
        var otu_id_2 = samples.otu_ids;
        var sample_values_2=samples.sample_values;
        var otu_labels_2=samples.otu_labels;
       

        //plot bubble chart
        var trace_2 = {
          x: otu_id_2,
          y: sample_values_2,
          text: otu_labels_2,
          mode: 'markers',
          marker: {
            color: otu_id_2,
            size: sample_values_2,
          }
        };
        
        var data_2 = [trace_2];
        
        var layout_2 = {
          title: 'Bubble Chart',
          showlegend: false,
          height: 600,
          width: 1100,
        };
        
        Plotly.newPlot('bubble', data_2, layout_2); 
        
        //gauge plot
        var wf = data.metadata.map(d => d.wfreq);
        var wf_id =wf[id-940];
        
        var data_3 = [
          { domain:{x:[0,1],y:[0,1]},
            type: "indicator",
            mode: "gauge+number",
            value: parseFloat(wf_id),
            title: {text:'Washing Frequency per Week'},
            gauge: {
              axis: { range: [null, 9],},
              steps: [
                { range: [0, 1], color: '#009a60' },
                { range: [1, 2], color: '#4aa84e' },
                { range: [2, 3], color: '#92b73a' },
                { range: [3, 4], color: '#c6bf22' },
                { range: [4, 5], color: '#edbd02' },
                { range: [5, 6], color: '#ffad00' },
                { range: [6, 7], color: '#ff8c00' },
                { range: [7, 8], color: '#fc6114' },
                { range: [8, 9], color: '#f43021' },
              ],
              needleType: "arrow",
              needleWidth: 2,
              needleCircleSize: 7,
              needleCircleOuter: true,
              needleCircleInner: false,

            }
          }
        ];
        
        //needle variables
        var degrees = parseFloat(wf_id)/9*180, radius = Math.PI;
        var radians = degrees * Math.PI / 180;
        var x = -1 * radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        console.log(x);
        console.log(y);

        var layout_3 = {
          width: 400,
          height: 300,
          margin: { t: 25, r: 25, l: 25, b: 25 },
          shapes:[{
            type: 'line',
            x0: 0.5,
            y0: 0.15,
            x1: x,
            y1: y+0.2,
            line: {
              color: 'black',
              width: 8
            }
          }],
        };
        
        Plotly.newPlot('gauge', data_3, layout_3);
      }
      );
    }



function metadata(id){
    d3.json("../samples.json").then((data) => {
        
        var metadata=data.metadata;
        //console.log(id);
        
        //filter metadata
        var samples = metadata.filter(s =>s.id.toString()===id)[0];
        //console.log(samples);

        var demographicInfo = d3.select('#sample-metadata');

        //empty demographicInfo
        demographicInfo.html('');

        //appen each demographic for id
        Object.entries(samples).forEach((key)=>{
          demographicInfo.append("h5").text(key[0]+": "+key[1]+"\n");

    });
  });
}

initialize();