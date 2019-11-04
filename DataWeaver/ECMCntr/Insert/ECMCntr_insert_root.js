// --------------------------------------------------------------
var ApDt =ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
var ApUserID = ODS.GetUserID();
// --------------------------------------------------------------

var dbconn = ODS.GetConnection();

sql ="INSERT INTO ECMCntr (cntr_id, box_id ,up_cntr_id \r\n" 
    +"    , cntr_nm, cntr_lv  , use_yn  \r\n"
    +"    , sort_seq ,ApDt, ApUserID ) \r\n"
	+"VALUES(  (SELECT LPAD(NVL(MAX(cntr_id), 0) + 1, 32, 0) cntr_id FROM ECMCntr), @box_id , 0 \r\n"
	+"    , @box_nm||'-문서함' , 0 , 'Y' \r\n"
	+"    , '1', @ApDt, @ApUserID ) \r\n"

dbconn.AddParameterInt("@box_id", 0 );
dbconn.AddParameter("@box_nm", Request.SUB_GetCellData("STMST", "box_nm", 0));
dbconn.AddParameter("@ApDt",ApDt );
dbconn.AddParameter("@ApUserID",ApUserID );

var count = dbconn.ExecuteNonQuery(sql);

Response.SetCellData("cntr_id", 0, 0);
Response.SetCellData("sort_seq", 0, 1);