import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';

import {XYPlot, VerticalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LabelSeries} from 'react-vis';

class App extends Component {

	constructor(props) {
    super(props);
    console.log("App-komponentti: konstruktori (rakentaja).");

    this.state = { tuntilista: [] };
    this.state2 = { lista: [] };
    this.state3 = { graphdata: [] };
    //this.state4 = { dropdowni: [] };
  }

  componentDidMount() {

    // console.log("App-komponentti: componentDidMount-metodissa.");
    // this.setState({ title: "Väliaikainen otsikko"} );

    fetch('https://reactraportti.azurewebsites.net/api/Workhours')
      .then(response => response.json())
      .then(json => {
        console.log(json);

        console.log("App-komponentti: aloitetaan setState()-kutsu.");
        this.setState({ tuntilista: json });
        console.log("App-komponentti: setState()-metodia kutsuttu.");

      });

    console.log("App-komponentti: Fetch-kutsu tehty.");
  }

  render() {

		console.log("App-komponentti: render-metodissa.");

    let viesti = "";
		let taulukko = [];

    //const lista = [];
    //const graphdata = [];

		if (this.state.tuntilista.length > 0) {

      // haetaan idt listasta
      var uniqueIds = this.state.tuntilista.map(function (ids) {
        return ids.employeeId
      });

      //console.log(uniqueIds);

      // otetaan vain uniikit idt
      let unique = [...new Set(uniqueIds)]; 

      //console.log(unique);
      //console.log(unique.length);
      
      // Lisätään IDt listaan
      for (let index2 = 0; index2 < unique.length; index2++){
        this.state2.lista.push({id: unique[index2], tunnit: 0, nimi: ""});
      }

      //console.log(this.state2.lista);
    
      // Haetaan kokonaistunnit ja idlle kohdistetut nimet ja kasataan ne lista-objektiin
      for (let avustin = 0; avustin < unique.length; avustin++) {
        for (let apu2 = 0; apu2 < this.state.tuntilista.length; apu2++) {
          const element2 = this.state.tuntilista[apu2];
          //console.log(element2);
          //console.log(avustin);
          //console.log(apu2);
          if (this.state2.lista[avustin].id === element2.employeeId) {
            this.state2.lista[avustin].tunnit = this.state2.lista[avustin].tunnit + element2.hours;
            this.state2.lista[avustin].nimi = element2.employeeName;
          }
          else {
            //console.log("Huti");
          }
        }
      }

      

      //console.log(this.state2.lista);

      // Tehdään uusi lista joka annetaan graphin piirtäjälle myöhemmin
      for (let apu3 = 0 ; apu3 < this.state2.lista.length ; apu3++) {
        this.state3.graphdata.push({x: this.state2.lista[apu3].nimi, y: this.state2.lista[apu3].tunnit, });
      }

      //console.log(this.state3.graphdata);
    }

    if (this.state.tuntilista.length > 0) {

      taulukko.push(<tr>
        <th>Tunti ID</th>
        <th>Työntekijän ID</th>
        <th>Projekti ID</th>
        <th>Päivämäärä</th>
        <th>Tunnit</th>
        <th>Työntekijän nimi</th>
        <th>Projektin nimi</th>
      </tr>);


      for (let index = 0; index < this.state.tuntilista.length; index++) {
        const element = this.state.tuntilista[index];
				//console.log(this.state.tuntilista[index]);

        taulukko.push(<tr>
          <td>{element.workhourId}</td>
          <td>{element.employeeId}</td>
          <td>{element.projectId}</td>
          <td>{element.date}</td>
          <td>{element.hours}</td>
          <td>{element.employeeName}</td>
          <td>{element.projectName}</td>
        </tr>);
      }
      
    }
    else {
      viesti = "Ladataan tietoja tietokannasta..."
    }

    console.log("graphdata");
    console.log(this.state3.graphdata);
  
    //for (let index = 0;index < this.state3.graphdata.length;index++){
    //  this.state4.dropdowni.push(<span>{this.state3.graphdata.x}</span>);
    //}
    
    //console.log(this.state4.dropdowni);

    return (
      <div className="App">

        <h1>Työtuntien raportointi Reactilla</h1>

        <a href="http://tyotunnit.azurewebsites.net/">Takaisin ASP.NET työtuntisivuille.</a>

        <h2>Työtuntitaulukko</h2>

        <p>Alla oleva graafi on tehty käyttäen <a href="http://uber.github.io/react-vis/">React-Vis</a> visualisointikirjastoa.</p>
        <p>Siinä on listattu jokainen työntekijä ja laskettu yhteen työtunnit palkkeihin.</p>

        <div className="Graph">
          <XYPlot height={500} width= {500} xType="ordinal" >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Työntekijät"/>
            <YAxis title="Tunnit yhteensä"/>
            <VerticalBarSeries data={this.state3.graphdata} />
            <LabelSeries
                      data={this.state3.graphdata.map(obj => {
                          return { ...obj, label: obj.y.toString() }
                      })}
                      labelAnchorX="middle"
                      labelAnchorY="text-before-edge"
                  />
          </XYPlot>
        </div>

				<h3>Tietokantahaku</h3>
      	<p>{viesti}</p>
        <p>Jos mitään ongelmia ei ole tietokannan haussa, niin alla olevassa taulukossa on tietokannan tiedot taulukossa.</p>
				<table id = "t01">
							<tbody>
									{taulukko}
							</tbody>
				</table>
      </div>
    );
  }
}

export default App;