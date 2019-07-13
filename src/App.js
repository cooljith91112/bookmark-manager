/*global chrome*/
import React, {Component} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import _ from 'lodash';
import moment from 'moment';
import './App.css';

class App extends Component {

  state = {
    bookMarkDataRaw: [],
    bookMarks: []
  }

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
      if(message.bookMarkData){
        this.setState({
          bookMarkDataRaw: message.bookMarkData[0]
        }, ()=>{           
          let collected = this.iterateBookMarks(this.state.bookMarkDataRaw.children, []);
          collected = _.map(collected, (nodes)=>{
            if(nodes.parentId){
              let parentNode = _.find(collected, {id: nodes.parentId});
              nodes.parentNode = parentNode ? parentNode.title : "";
            }
            return nodes;
          })
          this.setState({
            bookMarks: collected
          })
        })
      }
    });
    this.getBookMarks();
  }

  linkTemplate = (rowData, column) => {
    return <a style={{overflowWrap: 'break-word'}} href={rowData.url}>{rowData.url}</a>
  }

  dateTemplate = (rowData, column) => {
    if(rowData.dateAdded){
      return <span>{moment(rowData.dateAdded).format('MM-DD-YYYY hh:ss A')}</span>
    }else if(rowData.dateGroupModified){
      return <span>{moment(rowData.dateAdded).format('MM-DD-YYYY hh:ss A')}</span>
    }else {
      return <span></span>
    }
  }

  componentDidMount(){
    this.listenMessages();
  }

  iterateBookMarks = (children, consolidatedChildrens)=>{
    let bookMarkChildren = _.each(children, (child)=>{
      if(child.children && child.children.length>0){
        let currentNode = child;
        let currentNodeChildren = currentNode.children;
        console.log(currentNodeChildren);
        delete currentNode.children;
        consolidatedChildrens.push(currentNode);
        console.log(currentNodeChildren);
        this.iterateBookMarks(currentNodeChildren, consolidatedChildrens);
      }else{
        consolidatedChildrens.push(child);
      }
    });

    return consolidatedChildrens;
  }

  render(){
    var header = <div style={{'textAlign':'left'}}>
                        <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                        <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Search Bookmarks" size="50"/>
                        <button className="refresh" onClick={this.getBookMarks}>
                          <span className="pi pi-refresh"></span>
                        </button>
                    </div>;
    return (
      <div>
        <div className="content-section introduction">
          <div className="feature-intro">
          {/* <Button label="Secondary" className="p-button-raised p-button-secondary" onClick={this.getBookMarks}/> */}
          </div>
        </div>
  
        <div className="content-section implementation">
          <h3 className="header">BookMarks</h3>
          <DataTable value={this.state.bookMarks} sortMode="multiple" paginator={true} rows={10} header={header}
                        globalFilter={this.state.globalFilter} emptyMessage="No records found" resizableColumns={true} columnResizeMode="fit"
                        rowsPerPageOptions={[5,10,20,100,500]}>
                        <Column field="id" header="Id" sortable={true} style={{width:'93px'}}/>
                        {/* <Column field="index" header="Index" sortable={true} style={{width:'93px'}}/> */}
                        <Column field="parentNode" header="Parent" sortable={true} style={{width:'150px'}}/>
                        <Column field="title" header="Title" sortable={true} style={{width:'500px'}}/>
                        <Column field="url" header="Url" sortable={true}  style={{width:'402px'}} body={this.linkTemplate}/>
                        <Column field="dateAdded" header="Date Added" sortable={true} style={{width:'190px'}} body={this.dateTemplate}/>
                        <Column field="dateGroupModified" header="Date Modified" sortable={true} style={{width:'190px'}} body={this.dateTemplate}/>
                    </DataTable>
        </div>
      </div>
    );
  }
}

export default App;
