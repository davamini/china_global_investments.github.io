google.charts.load('current', {
    'packages':['corechart', 'geochart'], 
    'mapsApiKey':'AIzaSyCBYaGF8mL8Dh92AGSfwBgHjkDephxDSrs'
});

google.charts.setOnLoadCallback(drawRegionsMap);
google.charts.setOnLoadCallback(drawBarChart);
google.charts.setOnLoadCallback(drawLineChart);

var country_column_drawn = false;
var curr_country_for_column;
var company_data = [];
var year_data = [];
var country_data = [];
var company_investment_per_country = {};
var sector_investment_per_country = {};

d3.csv("china_data.csv").then(function(data) {

    var company_obj = {};
    var year_obj = {};
    var country_obj = {};

    var companies;
    var years;
    var countries;
    var sectors;

    for (i=0; i < data.length; i++) {
        var investor = data[i]['Investor'];
        var year = data[i]['Year'];
        var country = data[i]['Country']
        var sector = data[i]['Sector']

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

        if (country in company_investment_per_country) {
            if (investor in company_investment_per_country[country]) {
                company_investment_per_country[country][investor] += quantity_in_millions;
            } else {
                company_investment_per_country[country][investor] = quantity_in_millions;
            }
        } else {
            company_investment_per_country[country] = {};
            company_investment_per_country[country][investor] = quantity_in_millions;
        }

        if (country in sector_investment_per_country) {
            if (sector in sector_investment_per_country[country]) {
                sector_investment_per_country[country][sector] += quantity_in_millions;
            } else {
                sector_investment_per_country[country][sector] = quantity_in_millions;
            }
        } else {
            sector_investment_per_country[country] = {};
            sector_investment_per_country[country][sector] = quantity_in_millions;
        }
    }
    //console.log(company_investment_per_country);
    
    companies = Object.keys(company_obj);
    years = Object.keys(year_obj);
    countries = Object.keys(country_obj);
    country_companies = Object.keys(company_investment_per_country);
    country_sectors = Object.keys(sector_investment_per_country);

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
    company_data.unshift(['Company', 'Investments (Millions)']);

    year_data = year_data.sort(function(a, b) { return b[0] - a[0]; }).slice(0, 10).reverse();
    year_data.unshift(['Year', 'Investments (Millions)']);

    country_data.unshift(['Country', 'Total Investments (Millions)']);

    for (i=0; i < country_companies.length; i++) {
        country = country_companies[i];
        company_investment_per_country[country] = Object.entries(company_investment_per_country[country]).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 11);
        company_investment_per_country[country].unshift(['Company', 'Total Investments (Millions)']);
    }
    for (i=0; i < country_sectors.length; i++) {
        country = country_sectors[i];
        sector_investment_per_country[country] = Object.entries(sector_investment_per_country[country]).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
        sector_investment_per_country[country].unshift(['Sector', 'Total Investments (Millions)']);
    }
    console.log(sector_investment_per_country);
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
        title: "China's Total Global Investments Over Time in (Millions)",
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
    };

    var chart = new google.visualization.GeoChart(document.getElementById('countryChart'));

    chart.draw(data, options);
    function myClickHandler(){
        var selection = chart.getSelection();
        try {
            var row = parseInt(selection[0]['row']);
        } catch(TypeError) {
            return;
        }
        var country = country_data[row + 1][0];
        draw_investment_by_country(country);
        draw_sector_by_country(country);
    }
    google.visualization.events.addListener(chart, 'select', myClickHandler);
  }

function draw_investment_by_country(country) {
    var curr_data = company_investment_per_country[country];
    if (curr_data.length === 1) {
        console.log(curr_data.length)
        return;
    }
    var data = google.visualization.arrayToDataTable(curr_data);

    var options = {
        title: `Top Companies in ${country} by Total Investments (Millions)`,
        hAxis: {
            title: "Company",
          },
        vAxis: {
            title: "Investments (Millions)"
        },
        allowHtml: true,
        bar: {groupWidth: "30%"},
        legend: { position: "left" },
        animation:{
            startup: true,
            duration: 1000,
            easing: 'out',
        },
        colors:['red'],
        };
    var chart = new google.visualization.ColumnChart(document.getElementById("investment_by_country_chart"));
    chart.draw(data, options);
    country_column_drawn = true;
    curr_country_for_column = country;
}

function draw_sector_by_country(country) {

    var curr_data = sector_investment_per_country[country];
    if (curr_data.length === 1) {
        console.log(curr_data.length)
        return;
    }
    var data = google.visualization.arrayToDataTable(curr_data);

    var options = {
        title: `Top Sectors in ${country} by Total Investments (Millions)`,
        hAxis: {
            title: "Sector",
          },
        vAxis: {
            title: "Investments (Millions)"
        },
        allowHtml: true,
        bar: {groupWidth: "30%"},
        legend: { position: "left" },
        animation:{
            startup: true,
            duration: 1000,
            easing: 'out',
        },
        height: 500,
        colors:['red'],
        };
    var chart = new google.visualization.ColumnChart(document.getElementById("investment_by_sector_chart"));
    chart.draw(data, options);
    country_column_drawn = true;
    curr_country_for_column = country;
}

function resize() {
    drawRegionsMap();
    drawBarChart();
    drawLineChart();
    if (country_column_drawn) {
        draw_investment_by_country(curr_country_for_column);
        draw_sector_by_country(curr_country_for_column);
    }
}

window.onload = resize;
window.onresize = resize;
