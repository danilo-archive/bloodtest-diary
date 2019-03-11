# Responses format for db_controller:

### General format:
    { status: "OK", response: object}
    or
    { status: "ERR", err: object}

### For programming errors (malformed SQL):
    { status: "ERR", 
        err: {
            type: "SQL Error",
            code: sql_error_code,
            errno: sql_error_no,
            sqlMessage: sql_error_message
        }
    }
    
### For non-programming errors (well-formed SQL, but invalid request):
    { status: "ERR", 
        err: {
            type: "Invalid request.",
            cause: why_is_invalid
        }
    }

### SELECT query response:
    { status: "OK",
        response: {
            query: "OK",
            rows: [
                {obj1},
                {obj2},
                ...
            ]
        }
    }

### INSERT query response:
    { status: "OK",
        response: {
            query: "OK",
            affectedRows: n,
            insertId: n
        }
    }

<i>N.B. If you insert multiple values, `affectedRows` will equal the number of those values, but `insertId` will equal to a primary key of the the first inserted entry. If you want to obtain primary keys of all of them, call functions separately for each entry.</i>


### DELETE query response:
    { status: "OK",
        response: {
            query: "OK",  
            affectedRows: n,
        }
    }

<i>N.B. The query that is passed into this function should only delete one entry. This rule is not enforced in this function but should be enforced by the caller, otherwise unwanted data (entries that are currently being edited) might be deleted.</i>


### UPDATE query response:
    { status: "OK",
        response: {
            query: "OK",
            affectedRows: n,
            changedRows: n
        }
    }

<i>N.B. The query that is passed into this function should only update one entry. This rule is not enforced in this function but should be enforced by the caller, otherwise unwanted data (entries that are currently being edited) might also be updated.<br></i>


### REQUEST TOKEN, REFRESH TOKEN response:
    { status: "OK",
        response: {
            token: token_sequence,
            expires: yyyy-mm-dd HH:MM:ss,
        }
    }

<i>N.B. Currently you can only request editing for one entry.<br></i>


### CANCEL EDITING response:
    { status: "OK",
        response: "Editing successfully cancelled."
    }
