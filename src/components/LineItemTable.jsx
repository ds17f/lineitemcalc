import React, { Component } from 'react';
import LineItemRowDisplay from './LineItemRowDisplay'
import LineItemRowEdit from './LineItemRowEdit'

// props:
//  lineItems: an array of line items
//  onLineItemUpdate: function(ASIN, newValues)
class LineItemTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      editing: -1
    };


    this.handleDisplayRowEditClick = this.handleDisplayRowEditClick.bind(this);
    this.handleEditRowCancel = this.handleEditRowCancel.bind(this);
    this.handleEditRowCommit = this.handleEditRowCommit.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
  }

  handleDisplayRowEditClick(editIndex){
    this.setState({editing: editIndex});
  }

  handleEditRowCancel(){
    this.setState({editing: -1});
  }

  handleEditRowCommit(lineItem, newValue){
    console.log(lineItem);
    if (!newValue.ASIN){
      alert("Cannot commit with no ASIN");
    } else {
      this.props.onLineItemUpdate(lineItem, newValue);
      this.setState({editing: -1});
    }
  }

  handleRemoveRow(lineItem){
    this.props.onLineItemRemove(lineItem);
    this.setState({editing: -1});
  }

  componentWillReceiveProps(nextProps){
    console.log('LineItemTable');
    // find the first item which doesn't have a valid ASIN
    nextProps.lineItems.forEach((item, n) => {
      if(!item.ASIN) {
        // this is the one that we want to edit
        this.setState({
          editing: n,
        });
      }
    });
  }

  renderLineItems(){
    return this.props.lineItems.map((lineItem, n) => {
      if (this.state.editing === n) {
        // if this is a new item
        if (!lineItem.ASIN) {
          return <LineItemRowEdit key={lineItem.ASIN} index={n} lineItem={lineItem}
                                  onCancelClick={this.handleRemoveRow}
                                  onCommitClick={this.handleEditRowCommit}/>
        } else {
          // normal edit row of an existing item
          return <LineItemRowEdit key={lineItem.ASIN} index={n} lineItem={lineItem}
                                  onCancelClick={this.handleEditRowCancel}
                                  onCommitClick={this.handleEditRowCommit}/>
        }
      } else {
        return <LineItemRowDisplay key={lineItem.ASIN} index={n} lineItem={lineItem}
                                   onEditClick={this.handleDisplayRowEditClick}
                                   onRemoveClick={this.handleRemoveRow} />
      }
    });
  }

  render() {
    return(
      <table className="table table-condensed">
        <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>ASIN</th>
          <th>Price</th>
          <th>Shipping</th>
          <th>Tax</th>
          <th>Quantity</th>
          <th></th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          {this.renderLineItems()}
        </tbody>
      </table>
    )
  }

}

export default LineItemTable;