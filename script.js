$(document).ready(function(){
  $('.date').val('2017-01-01');
  $('select').val('');
  $('.amount').val('');
  getData();
  $('button').click(function () {
    var date = $('.date').val();
    var salesman = $('select').val();
    var amount = parseInt($('.amount').val());
    if (date.length > 0 && salesman.length > 0 && amount > 0) {
      addSale(salesman,amount,moment(date).format('DD-MM-YYYY'));
    }else{
      alert('Dati da inserire non validi!')
    }
  })
});

function getData(){
  $.ajax({
    'url': 'http://157.230.17.132:4021/sales',
    'method': 'GET',
    'success': function (data) {
      getSalesmanData(data);
      getMonthData(data);
    },
    'error': function () {
      alert('errore');
    }
  });
}

function addSale(salesman,amount,date) {
  $.ajax({
    'url': 'http://157.230.17.132:4021/sales',
    'method': 'POST',
    'data':{
      'salesman':salesman,
      'amount':amount,
      'date':date,
    },
    'success': function () {
      getData();
    },
    'error': function () {
      alert('errore');
    }
  });
}

function getMonthData(data) {
  var months_Sales = {
    "January": 0,
    "February": 0,
    "March": 0,
    "April": 0,
    "May": 0,
    "June": 0,
    "July": 0,
    "August": 0,
    "September": 0,
    "October": 0,
    "November": 0,
    "December": 0
  };

  //ciclo che va a riempire la values di months_Sales rispettivamente al mese corrente
  //con l'importo di ogni vendita
  for (var i = 0; i < data.length; i++) {
    var current_sale = data[i];
    var amount = parseInt(current_sale.amount);
    var current_month = moment(current_sale.date,'DD-MM-YYYY').format('MMMM');
    months_Sales[current_month] += amount
  }
  //console.log(months_Sales);
  var month_label = Object.keys(months_Sales);
  var month_data_label = Object.values(months_Sales);
  //console.log(month_label,month_data_label);
  getLineChart(month_data_label,month_label)
}


//funzione dei data per il grafico a torta
function getSalesmanData(data) {
  var sales = [];
  for (var i = 0; i < data.length; i++) {
    var current_sale = data[i];
    var salesman = current_sale.salesman;
    var amount = parseInt(current_sale.amount);
    var total_amount = 0;
    var sales_to_add = Object.keys(sales);
    if (!sales_to_add.includes(salesman)) {
      sales[salesman] = amount;
    }else{
      sales[salesman] += amount;
    }
    total_amount += amount
  }
  var salesman_label = Object.keys(sales);
  var sales_data_label = Object.values(sales);
  //ciclo for per ricavare la percentuale di ogni venditore
  for (var i = 0; i < sales_data_label.length; i++) {
    sales_data_label[i] = ((sales_data_label[i]*salesman_label.length)/total_amount).toFixed(1);
  }
  console.log(Object.values(sales));
  getPieChart(sales_data_label,salesman_label)
}

function getLineChart(data,label){
  var myLineChart = new Chart($('#myLineChart'), {
    type: 'line',
    data: {
      'datasets':[{
        'data': data,
        'borderColor': "#36a2eb",
        'backgroundColor': "#ffcd56",
        'label': 'Anno 2017'
      }],
      'labels': label
    },
    options: {
      'title':{
        'display': true,
        'text': "Vendite mensili totali",
        'fontSize': '30'
      },
      'legend':{
        'display': true,
        'labels':{
          'fontSize': 22
        }
      }
    }
  });
}



function getPieChart(data, label) {
  var myPieChart = new Chart($('#myPieChart'), {
    type: 'pie',
    data: {
      'datasets':[{
        'data': data,
        'backgroundColor': ["#ff6384","#36a2eb","#ffcd56","#9dd5c0"]
      }],
      'labels': label
    },
    options: {
      'title':{
        'display': true,
        'text': "Vendite totali venditori",
        'fontSize': '30'
      },
      'legend':{
        'labels':{
          'fontSize': 22
        }
      }
    }
});
}
