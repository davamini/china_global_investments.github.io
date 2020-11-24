google.charts.load('current', {
    'packages':['corechart', 'geochart'], 
    'mapsApiKey':'AIzaSyCBYaGF8mL8Dh92AGSfwBgHjkDephxDSrs'});

google.charts.setOnLoadCallback(drawBarChart);
google.charts.setOnLoadCallback(drawLineChart);
google.charts.setOnLoadCallback(drawRegionsMap);

var company_data = [];
var year_data = [];
var country_data = [];
d3.csv("china_data.csv").then(function(data) {

    var company_obj = {};
    var year_obj = {};
    var country_obj = {};

    var companies;
    var years;
    var countries;

    for (i=0; i < data.length; i++) {
        var investor = data[i]['Investor'];
        var year = data[i]['Year'];
        var country = data[i]['Country']
        var quantity_in_millions = parseInt(data[i][' Quantity in Millions '].replace('$', '').replace(',', ''));
        if (investor in company_obj) {
            company_obj[investor] += quantity_in_millions
        } else {
            company_obj[investor] = quantity_in_millions
        }

        if (year in year_obj) {
            year_obj[year] += quantity_in_millions
        } else {
            year_obj[year] = quantity_in_millions
        }
        switch (country) {
            case 'USA':
                country = 'United States'
                break;
            case 'Russian Federation':
                country = 'Russia'
                break;
            case 'Britain':
                country = 'United Kingdom'
                break;
            default:
                country=country;
        }
        if (country in country_obj) {
            country_obj[country] += quantity_in_millions
        } else {
            country_obj[country] = quantity_in_millions
        }
    }
    
    companies = Object.keys(company_obj);
    years = Object.keys(year_obj);
    countries = Object.keys(country_obj);

    for (i=0; i < companies.length; i++) {
        var total_invest = company_obj[companies[i]];
        var curr_company = companies[i];
        var new_obj = [curr_company, total_invest]; 
        company_data.push(new_obj);
    }
    for (i=0; i<years.length; i++) {
        var total_invest = year_obj[years[i]];
        var curr_year = years[i];
        var new_obj = [curr_year, total_invest]
        year_data.push(new_obj)
    }
    for (i=0; i<countries.length; i++) {
        var total_invest = country_obj[countries[i]];
        var curr_country = countries[i];
        var new_obj = [curr_country, total_invest]
        country_data.push(new_obj)
    }
    company_data = company_data.sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
    company_data.unshift(['Company', 'Investments']);

    year_data = year_data.sort(function(a, b) { return b[0] - a[0]; }).slice(0, 10).reverse();
    year_data.unshift(['Year', 'Investments']);

    country_data.unshift(['Country', 'Investments']);
});

function drawBarChart() {
    
    var data = google.visualization.arrayToDataTable(company_data);

    var options = {
    title: 'Top 10 Companies by Global Investment (Millions)',
    subtitle: "<a href='https://www.aei.org/china-global-investment-tracker/?ncid=txtlnkusaolp00000618'>Source</a>",
    allowHtml: true,
    legend: {position: 'none'},
    hAxis: {
        title: "Company",
      },
    vAxis: {
        title: "Investments (Millions)"
    },
    bar: { groupWidth: '35%' },
    animation:{
        startup: true,
        duration: 1000,
        easing: 'out',
    },
    colors:['red'],
    };
    var chart = new google.visualization.BarChart(document.getElementById('barchart'));

    chart.draw(data, options);
}

function drawLineChart() {

    var data = google.visualization.arrayToDataTable(year_data);

      var options = {
        title: 'Top 10 Countries China Invests in (Millions)',
        hAxis: {
            title: "Year",
          },
        vAxis: {
            title: "Investments (Millions)"
        },
        legend: {position: 'top'},
        animation:{
            startup: true,
            duration: 1000,
            easing: 'out',
        },
        colors:['red'],
      };

      var chart = new google.visualization.LineChart(document.getElementById('linechart'));

      chart.draw(data, options);
    
}

function initMap(){
    //Prevents API console error for some reason
}

function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable(country_data);

    var options = {
        legend: {textStyle: {color: 'black', fontSize: 16}},
        colorAxis: {colors: ['white', '#f76565', 'red']},
        title: 'Top 10 Countries China Invests in (Millions)',
    };

    var chart = new google.visualization.GeoChart(document.getElementById('countryChart'));

    chart.draw(data, options);
  }

function resize() {
    drawLineChart();
    drawBarChart();
    drawRegionsMap()
}
window.onload = resize;
window.onresize = resize;