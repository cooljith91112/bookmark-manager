/*global chrome*/
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
class App extends React.Component {

  /* Open port on popup file */
  port = chrome.runtime.connect({
    name: "bookmarkArranger"
  });

  getBookMarks = () => {
    this.port.postMessage({
        code: "getBookMarks"
    });
  }

  listenMessages = () => {
    this.port.onMessage.addListener(message => {
      console.log(message)
    });
  }

  componentDidMount(){
    this.listenMessages();
  }

  render(){
    return (
      <div>
        <div className="content-section introduction">
          <div className="feature-intro">
            <h1>DataTable - Sort</h1>
            <p>Enabling sortable property on a column is enough to make a column sortable. Multiple column sorting is enabled using sortMode property and
                  used with metaKey.</p>
          </div>
        </div>
  
        <div className="content-section implementation">
          <h3>Single Column</h3>
          {/* <DataTable value={this.state.cars}>
            <Column field="vin" header="Vin" sortable={true} />
            <Column field="year" header="Year" sortable={true} />
            <Column field="brand" header="Brand" sortable={true} />
            <Column field="color" header="Color" sortable={true} />
          </DataTable>
  
          <h3>Multiple Columns</h3>
          <DataTable value={this.state.cars} sortMode="multiple">
            <Column field="vin" header="Vin" sortable={true} />
            <Column field="year" header="Year" sortable={true} />
            <Column field="brand" header="Brand" sortable={true} />
            <Column field="color" header="Color" sortable={true} />
          </DataTable> */}
        </div>
      </div>
    );
  }
}

export default App;
