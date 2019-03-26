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

  handleSearch = (e) => {
    const search = e.target.value
    this.setState(() => ({
      tickets: this.state.tickets.filter((ticket) => {
        return( ticket.name.includes(search))
        })
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

    const options = {
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
    
		const options1 = {
			exportEnabled: true,
			animationEnabled: true,
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: [          
          {y: salesLength.length, label: "Sales" },
					{y: technicalLength.length, label: "Technical" },
					{y: marketingLength.length, label: "Marketing" }
				]
			}]
		}

    return (
      <div>
          <h2>Ticket Master</h2>
          
          <div class="col-md-3 col-centered">
            <input type="search" onChange={this.handleSearch}/><br/> <br/>
          </div>

          <div class="float-left">
            <h3>Listing Tickets = {this.state.tickets.length} </h3>
          </div>

          <div class="col-md-3 col-centered"> 
            <input type="button" value="All" onClick={this.handleAll}/>
            <input type="button" value="Low" onClick={this.handleLow}/>
            <input type="button" value="Medium" onClick={this.handleMedium}/>
            <input type="button" value="High" onClick={this.handleHigh}/> <br/><br/>
          </div> 
            

          <div>
            <table>
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
          </div>  

          <div class="progress">
            <Progress value={this.state.tickets.length}/><br/>
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

          <div style={{ height: 50, width: 300 }}>
            <h2>Charts</h2>
            <CanvasJSChart options = {options}/>
            <CanvasJSChart options = {options1}/>
          </div>  
      </div>
    );
  }
}

export default App;
