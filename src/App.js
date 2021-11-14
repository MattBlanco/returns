import "./App.css";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Slider, { SliderTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

function Loader() {
  return (
    <>
      <p>Now loading</p>
      <Spinner animation="border" variant="primary" />
      <Spinner animation="border" variant="secondary" />
      <Spinner animation="border" variant="success" />
      <Spinner animation="border" variant="danger" />
      <Spinner animation="border" variant="warning" />
      <Spinner animation="border" variant="info" />
      <Spinner animation="border" variant="light" />
      <Spinner animation="border" variant="dark" />
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="dark" />
    </>
  );
}

function App() {
  const [isLoading, setLoading] = useState(true);
  const [returns, setReturns] = useState([]);
  const [currentYears, setCurrentYears] = useState([]);
  const [currentReturns, setCurrentReturns] = useState([]);
  const [value, setValue] = useState([1926, 2020]);
  const proxyurl = "https://cors-light-anytime.herokuapp.com/"; //personal host for cors proxy
  const returnsjson = "https://www.slickcharts.com/sp500/returns/history.json";

  useEffect(() => {
    isLoading &&
      fetch(proxyurl + returnsjson)
        .then((response) => response.json())
        .then((data) => {
          setReturns(data.reverse());
          setCurrentReturns(data.reverse());
          calculateCumulativeReturns(data.reverse());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  const calculateCumulativeReturns = (data) => {
    let total = 0.0;
    setCurrentReturns(
      data.map((element) => {
        total += parseFloat(element.totalReturn);
        return {
          year: element.year,
          totalReturn: element.totalReturn,
          cumulativeReturn: parseFloat(total).toFixed(2),
        };
      })
    );
  };

  const renderContent = () => {
    return (
      <tbody>
        {currentReturns.length !== 0 &&
          currentReturns.map(({ year, totalReturn, cumulativeReturn }) => (
            <tr key={year}>
              <td>{year}</td>
              <td>{totalReturn}</td>
              <td>{cumulativeReturn}</td>
            </tr>
          ))}
      </tbody>
    );
  };

  const handleChange = (value) => {
    console.log(value);
    calculateCumulativeReturns(
      returns.slice(
        returns.findIndex((i) => i.year === value[0]),
        returns.findIndex((i) => i.year === value[1]) + 1
      )
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <div style={{ width: 400, margin: 50 }}>
        <p>Select Desired Years</p>
        <Range
          min={value[0]}
          max={value[1]}
          defaultValue={value}
          tipFormatter={(value) => `${value}`}
          onAfterChange={(event) => handleChange(event)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Year</th>
            <th>Total Returns</th>
            <th>Cumulative Returns</th>
          </tr>
        </thead>
        {renderContent()}
      </Table>
    </div>
  );
}

export default App;
