import React from "react";
import "./patientsTable.css";

class PatientsTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            allPatients: props.allPatients
        };
    }


    render() {
        console.log(this.state.allPatients);
        return (
            <table className="table-fill">
                <thead>
                    <tr>
                        <th className="text-left">Patient number</th>
                        <th className="text-left">Patient name</th>
                        <th className="text-left">Patient surname</th>
                        <th className="text-left">Patient email</th>
                        <th className="text-left">Patient phone</th>
                    </tr>
                </thead>
                <tbody className="table-hover">
                    <tr>
                        <td className="text-left filter-row"><input className={"input-filter"} type={"text"} name={"patient-no-filter"} placeholder={"Patient number"}/></td>
                        <td className="text-left filter-row"><input className={"input-filter"} type={"text"} name={"patient-name-filter"} placeholder={"Patient name"}/></td>
                        <td className="text-left filter-row"><input className={"input-filter"} type={"text"} name={"patient-surname-filter"} placeholder={"Patient surname"}/></td>
                        <td className="text-left filter-row"><input className={"input-filter"} type={"text"} name={"patient-email-filter"} placeholder={"Patient email"}/></td>
                        <td className="text-left filter-row"><input className={"input-filter"} type={"text"} name={"patient-phone-filter"} placeholder={"Patient phone"}/></td>
                    </tr>
                    <tr>
                        <td className="text-left">January</td>
                        <td className="text-left">$ 50,000.00</td>
                    </tr>
                    <tr>
                        <td className="text-left">February</td>
                        <td className="text-left">$ 10,000.00</td>
                    </tr>
                    <tr>
                        <td className="text-left">March</td>
                        <td className="text-left">$ 85,000.00</td>
                    </tr>
                    <tr>
                        <td className="text-left">April</td>
                        <td className="text-left">$ 56,000.00</td>
                    </tr>
                    <tr>
                        <td className="text-left">May</td>
                        <td className="text-left">$ 98,000.00</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default PatientsTable;
