import React from "react";

export default props => {
    return (
        <tr>
            <td className={"text-left"}>{props.patient_no}</td>
            <td className={"text-left"}>{props.patient_name}</td>
            <td className={"text-left"}>{props.patient_surname}</td>
            <td className={"text-left"}>{props.patient_email}</td>
            <td className={"text-left"}>{props.patient_phone}</td>
        </tr>
    );
};
