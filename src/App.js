import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import CanvasJSReact from './canvasjs-2.3.1/canvasjs.react';
import axios from "axios";
import logo from './logo.svg';
import './App.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart

class App extends Component {
  constructor(){
    super()
    this.state = {
      name: "",
      department: "",
      priority: "",
      message: "",
      tickets: []
    }
  }

  componentDidMount(){
    axios.get('http://dct-api-data.herokuapp.com/tickets?api_key=c84c97f8868e2fa5')
      .then((ticket) => {
        this.setState(() => ({tickets: ticket.data}))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleName = (e) => {
    const name = e.target.value
    this.setState(() => ({name}))
  }

  handleDepartment = (e) => {
    const department = e.target.value
    this.setState(() => ({department}))
  }

  handlePriority = (e) => {
    const priority = e.target.value
    this.setState(() => ({priority}))
  }

  handleMessage = (e) => {
    const message = e.target.value
    this.setState(() => ({message}))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      name: this.state.name,
      department: this.state.department,
      priority: this.state.priority,
      message: this.state.message,
    }
    
    axios.post('http://dct-api-data.herokuapp.com/tickets?api_key=c84c97f8868e2fa5', formData)
      .then((ticket) => {
        this.setState((prevState) => ({tickets: [...prevState.tickets, ticket.data]}))

        // this is to keep form empty after submitting
        this.setState(() => ({
            name: "",
            department: "",
            priority: "",
            message: ""
          
        }))

      })
      .catch(function(err){
        console.log(err)
      })
  }

  handleLow = (e) => {    
    this.setState(() => ({
      tickets: this.state.tickets.filter(ticket => ticket.priority == 'low')
    }))
  }

  handleMedium = (e) => {
    this.setState(() => ({
      tickets: this.state.tickets.filter(ticket => ticket.priority == 'medium')
    }))
  }

  handleHigh = (e) => {
    this.setState(() => ({
      tickets: this.state.tickets.filter((ticket) => {return(ticket.priority == 'high')})
    }))
  }

  handleAll = (e) => {
    this.setState(() => ({
      tickets: this.state.tickets
    }))
  }

  render() {
    var salesLength = this.state.tickets.filter( (depart) => {
      return(
        depart.department == "sales"
      )
    })

    var technicalLength = this.state.tickets.filter( (depart) => {
      return(
        depart.department == "technical"
      )
    })

    var marketingLength = this.state.tickets.filter( (depart) => {
      return(
        depart.department == "marketing"
      )
    })

    console.log("lengthsssssssssssssssss")
    console.log(salesLength.length)
    console.log(technicalLength.length)
    console.log(marketingLength.length)

    const options = {
			title: {
				text: "Basic Column Chart"
			},
			data: [
			{
				// Change type to "doughnut", "line", "splineArea", etc.
				type: "column",
				dataPoints: [
					{ label: "Sales",  y: salesLength.length },
					{ label: "Technical", y: technicalLength.length },
					{ label: "Marketing", y: marketingLength.length }
				]
			}
			]
    }
    
    return (
      <div>
          <h2>Ticket Master</h2>

          <h3>Listing Tickets = {this.state.tickets.length} </h3>

          <h3>here comes the tabs </h3>
          <input type="search"/><br/> <br/>
          <input type="button" value="All" onClick={this.handleAll}/>
          <input type="button" value="Low" onClick={this.handleLow}/>
          <input type="button" value="Medium" onClick={this.handleMedium}/>
          <input type="button" value="High" onClick={this.handleHigh}/> <br/><br/>

          <table border="1">
              <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
              </thead>

              <tbody>
                  {
                    this.state.tickets.map((tick) => {
                      return (
                        <tr key={tick.ticket_code}>
                          <td>{tick.ticket_code}</td>
                          <td>{tick.name}</td>
                          <td>{tick.department}</td>
                          <td>{tick.priority}</td>
                          <td>{tick.message}</td>
                          <td>{tick.status}</td>
                        </tr>  
                      )
                    }) 
                  } 
              </tbody>
          </table><br/>

          <div>
            <Progress value={this.state.tickets.length} /><br/>
          </div>
          
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.name} onChange={this.handleName}/>
              </label> <br/>

              <label>
                Department:
                <select onChange={this.handleDepartment}>
                  <option value="">select</option>
                  <option value="sales">sales</option>
                  <option value="technical">technical</option>
                  <option value="marketing">marketing</option>
                </select>  
              </label><br/>

                <label>
                  Priority:
                  <select onChange={this.handlePriority}>
                    <option value="">select</option>
                    <option value="high">high</option>
                    <option value="medium">medium</option>
                    <option value="low">low</option>
                  </select>
                </label><br/>

                <label>
                  Message:
                  <textarea value={this.state.message} onChange={this.handleMessage}></textarea> 
                </label><br/>

                <label>
                  <input type="submit"/> 
                </label><br/>
            </form>  
          </div>

          <div className="Charts">
            <h2>Charts</h2>
            <CanvasJSChart options = {options}/>
          </div>  
      </div>
    );
  }
}

export default App;
