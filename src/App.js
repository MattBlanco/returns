import "./App.css";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
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
  const [allReturns, setAllReturns] = useState([]);
  const [currentReturns, setCurrentReturns] = useState([]);
  const [value, setValue] = useState([1926, 2020]);
  const proxyurl = "https://cors-light-anytime.herokuapp.com/"; //personal host for cors proxy
  const returnsjson = "https://www.slickcharts.com/sp500/returns/history.json";

  useEffect(() => {
    isLoading &&
      fetch(proxyurl + returnsjson)
        .then((response) => response.json())
        .then((data) => {
          setAllReturns(data.reverse());
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
              <td
                align="right"
                className={totalReturn < 0 ? "text-danger" : ""}
              >
                {totalReturn}
              </td>
              <td align="right">{cumulativeReturn}</td>
            </tr>
          ))}
      </tbody>
    );
  };

  const handleChange = (value) => {
    console.log(value);
    calculateCumulativeReturns(
      allReturns.slice(
        allReturns.findIndex((i) => i.year === value[0]),
        allReturns.findIndex((i) => i.year === value[1]) + 1
      )
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Container className="mt-5">
      <div>
        <h2>S&P 500 Total Returns</h2>
        <div style={{ margin: 25 }}>
          <p>Select Desired Years</p>
          <Range
            min={value[0]}
            max={value[1]}
            defaultValue={value}
            tipFormatter={(value) => `${value}`}
            onAfterChange={(event) => handleChange(event)}
          />
        </div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Year</th>
              <th style={{ textAlign: "right" }}>Total Returns</th>
              <th style={{ textAlign: "right" }}>Cumulative Returns</th>
            </tr>
          </thead>
          {renderContent()}
        </Table>
      </div>
    </Container>
  );
}

export default App;
