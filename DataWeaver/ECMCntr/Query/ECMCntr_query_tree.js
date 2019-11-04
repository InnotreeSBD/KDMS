

var dbconn = ODS.GetConnection();

var query_type = Request.ParamGet("query_type"); // root OR base

var sql ="SELECT cntr_id, box_id, up_cntr_id \r\n"
         +"    , cntr_nm, cntr_lv, use_yn \r\n"
         +"    , sort_seq, ApDt, ApUserID \r\n"
         +"    , UpDt, UpUserID \r\n"
         +"FROM ECMCntr  \r\n"
         +"WHERE box_id=@box_id \r\n"
         +"  AND 1=1 \r\n"

if ( query_type == "root" )
    sql = sql+ "AND cntr_lv = 0 \r\n"
else
    sql = sql+ "AND cntr_lv <> 0 \r\n"

sql =sql+" ORDER BY cntr_lv, up_cntr_id, sort_seq \r\n";


dbconn.AddParameterInt("@box_id", Request.ParamGet("box_id"));


ODS.TraceQueryState("ECMCntr_query_tree "+query_type, sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


