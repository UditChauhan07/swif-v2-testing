import React, { useState ,useEffect} from 'react'
import Header from '../../../../Components/Header/Header'
import { convertToSelectedCurrency } from '../../../../lib/store';


const CurrencyMangment = () => {
  const [selectedCountry, setSelectedCountry] = useState('INR');
  const [currencyData,setCurrencyData] = useState(null);
  const [currencyRate, setCurrencyRate] = useState(1);
  const token=localStorage.getItem('UserToken');
  const currencyCodes = [
    "USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CNY", "CHF", "BRL",
    "SGD", "HKD", "NZD", "KRW", "ZAR", "SEK", "NOK", "MXN", "RUB", "THB"
  ];
  const dummyData = [
    { id: 1, featureName: 'Work Order Creation', price: 100 },
    { id: 2, featureName: 'Work order Execution', price: 200 },
    { id: 3, featureName: 'Customer Creation', price: 300 },
    { id: 4, featureName: 'Office User Creation', price: 300 },
    { id: 4, featureName: 'Field User Creation', price: 300 }
  ];

  useEffect(() => { 
    if(!currencyData) {
      convertToSelectedCurrency(null,selectedCountry,token) // countryname,currency code, token
     .then((data) =>{
      console.log("dataaaaaaa",data)
      setCurrencyData(data)
     })
     .catch((error) => console.error('Error:', error));
    }
  }, []);
  // console.log(currencyData)
  const handleCurrencyChange = async(e) => {
    setSelectedCountry(e.target.value)
    const filteredcurrency = currencyData?.exchange_rates[e.target.value]
    setCurrencyRate(filteredcurrency)
  }
  

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
        <div className="container">
            <h2 className="mb-4">Currency Management</h2>
            <label htmlFor="currencySelect" className="form-label">Select Currency:</label>

            <div className="mb-3 col-1">
              <select
                id="currencySelect"
                className="form-select"
                value={selectedCountry}
                onChange={handleCurrencyChange}
              >
                {currencyCodes.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Feature Name</th>
                  <th>Price (USD)</th>
                  <th>Price ({selectedCountry})</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.featureName}</td>
                    <td>{item.price}</td>
                    <td>{(item.price * currencyRate).toFixed(2)} {selectedCountry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default CurrencyMangment
