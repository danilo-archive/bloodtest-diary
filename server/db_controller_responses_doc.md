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
            type: "Invalid request",
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

### DELETE query response:
    { status: "OK",
        response: {
            query: "OK",  
            affectedRows: n,
        }
    }

### UPDATE query response:
    { status: "OK",
        response: {
            query: "OK",
            affectedRows: n,
            changedRows: n
        }
    }

### REQUEST TOKEN response:
    { status: "OK",
        response: {
            token: token_sequence,
            expires: yyyy-mm-dd HH:MM:ss,
        }
    }
