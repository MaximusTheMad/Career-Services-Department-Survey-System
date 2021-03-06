<?php

class AccountActivate{
    public static function pActivate($db){

        error_reporting(E_ALL);
        
        include_once "./pollster/pActivate.html";
        include_once "./pollster/pDashboard.html";

         //Deletes accounts when activation fails, to prevent primary key error from being thrown by the database.
         function deleteInactive($db, $conn){
            $sql = "DELETE FROM accounts WHERE active = 0;";
            $del = $conn->prepare($sql);
            $del->execute();

            if(!$del){
                echo "Internal error. Inactive accounts were not deleted from accounts table.";
                }
            }//end deleteInactive()

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
  
            $conn = $db->getConnection('poll');

            if(isset($_POST['token'])){
                $token = $_POST['token'];
            }else{
                http_response_code(400);
                echo "Token not received in pActivate.php.";
                deleteInactive($db, $conn);
                exit();
            }

            //Make sure token arrived as hexadecimal
            if(preg_match('/^[0-9A-Fa-f]+$/', $token)){

                $queryHash = hash("sha256", $token, FALSE);

                //get record from db by matching hashed token received with hashed token that is stored in tokens table.
                $sql = "SELECT acctName, expiration, tokenUsed FROM tokens WHERE tokenHash = ?;";

                $result = $conn->prepare($sql);
                $result->execute(array($queryHash));

                $numRows = $result->rowCount();

                if($numRows == 0){
                    deleteInactive($db, $conn);
                    header("Location: ./pollster/pActivate.html?error=tokenRemoved");
                    die();
                }

                if($numRows == 1){
                   $row = $result->fetch(PDO::FETCH_ASSOC);

                   //If token hasn't expired...
                   $expiration = strtotime($row['expiration']);
            
                    if($expiration < strtotime(date("Y-m-d H:i:s"))){
                    deleteInactive($db, $conn);
                    header("Location: ./pollster/pActivate.html?error=tokenExpired");
                    die("Token Expired");
                    }

                   $used = $row['tokenUsed'];
                   //Check to see if the token was used previously
                   if($used){
                   header("Location: ./pollster/pActivate.html?error=tokenUsed");
                   die("Token Used");
                   }

                    $acctName = $row['acctName'];        
                    $true = 1;
    
                    $sql = "UPDATE accounts SET active = ? WHERE acctName = ?;";
    
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(1, $true);
                    $stmt->bindParam(2, $acctName);
                    $stmt->execute();
    
                   if(!$stmt){
                    echo "Internal error. Account activation failed. Please try again.";
                    deleteInactive($db, $conn);
                    exit();
                   }else{ //$stmt executed correctly

                    $stmt = null;
                    //Mark token as "used", and redirect to the pollster dashboard:
                    $used = true;
    
                    $sql = "UPDATE tokens SET tokenUsed = ?;";
    
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(1, $used);
                    $stmt->execute();       
    
                    if(!$stmt){//token update failed
                        echo "Internal error. Token not updated to 'used'.";
                    }
                    //This account has been set to "active". Get rid of all accounts that are not.
                    deleteInactive($db, $conn);

                  //Everything is ok, so redirect to dashboard:
                  session_start();
                  session_destroy();
                  session_start();
                  $_SESSION["userName"] = $acctName;

                 header("Location: ./pollster/pDashboard.html?view=first"); 
                 die();
                    } //$stmt executed correctly
                //More than one row is returned from token table query. Should never happen.
                }else{ 
                    echo "Internal error. There is more than one account associated with this Token.";
                    deleteInactive($db, $conn);                
                    die();
                     } 
            }else{// token was not correctly formatted when it arrived (not hexadecimal)
                  echo "Error. Link has been corrupted.";
                  deleteInactive($db, $conn);
                  die();
            }
                
            }else{//server request method not === POST
              http_response_code(400);
             exit();
            }//last else
         }//end pActivate
    }//end class
?>