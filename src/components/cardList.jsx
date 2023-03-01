import React from "react";
import TaskCard from "./taskCard";

// const style = { background: "#cccccc", padding: "8px" };

const CardList = (props) => {
    return <div >
        {props.data?.map((obj) => <TaskCard id={obj.id} title={obj.title} endDate={obj.endDate} status={obj.status} />)}
    </div>
};

export default CardList;
