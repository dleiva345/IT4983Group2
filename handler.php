<?php

    function db_connect() {

        # DECLARE STATIC VARIABLE $CONNECTION TO AVOID CREATING
        # MULTIPLE UNNECESSARY CONNECTIONS TO THE DATABASE.
        static $connection;

        if (!isset($connection)) {

            try {

                # MOVE SETTINGS.INI TO INACCESSIBLE CONFIGURATION FILE
                # BEFORE IMPLEMENTING ON A FORWARD-FACING PUBLIC SERVER.
                $settings = parse_ini_file('./settings.ini');

                # GET CONNECTION VARIABLES.
                $db_type = $settings['db_type'];
                $db_host = $settings['db_host'];
                $db_name = $settings['db_name'];
                $db_user = $settings['db_user'];
                $db_pass = $settings['db_pass'];

                $options = array(
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                );

                # COMBINE TYPE, HOST, AND NAME.
                $db_info = "${db_type}:host=${db_host}; dbname=${db_name}";

                # ESTABLISH DATABASE CONNECTION.
                $connection = new PDO($db_info, $db_user, $db_pass, $options);

            # HANDLE CONNECTION ERRORS.
            } catch (PDOException $error) {
                $error_num = $error -> getCode();
                $error_msg = $error -> getMessage();
                exit("Connection Error ($error_num): $error_msg");
            };
        };

        # RETURN CONNECTION.
        return $connection;

    };

    function db_query($query) {

        # GET CONNECTION.
        $connection = db_connect();

        # NEED TO SANITIZE QUERY, AND IMPLEMENT PREPARED
        # STATEMENTS TO PREVENT SQL INJECTION ATTACKS.

        # EXECUTE QUERY.
        $statement = $connection -> query($query);

        # RETURN RESULTS IF.
        if ($_SERVER['REQUEST_METHOD'] == "GET") {

            # SET HEADER CONTENT-TYPE
            header('Content-Type: application/json');

            # FETCH THE RESULTS.
            $results = $statement -> fetchAll();

            # RETURN THE RESULTS.
            echo json_encode($results);

        };
    };

    # EXECUTE QUERY.
    db_query($_REQUEST['query']);

 ?>
