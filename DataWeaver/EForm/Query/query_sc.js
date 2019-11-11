

var dbconn = ODS.GetConnection();


var sql ="SELECT EFormID, EFormCd, CmpyCd \r\n"
         +"    , EFormNm, EFormTp, EFormXML, MapSQL \r\n"
         +"    , CatCd1, CatCd2, ParentID \r\n"
         +"    , Lv, DispSeq, Remarks \r\n"
         +"    , DicID, CallType, ApUserID \r\n"
         +"    , ApDt, UpUserID, UpDt \r\n"
         +"FROM EForm  \r\n"
         +"WHERE EFormID=@EFormID \r\n"
        +"   AND EFormTp = '10' \r\n"


if ( Request.ParamGet("CmpyCd") != "" ) sql =sql+"   AND CmpyCd = @CmpyCd \r\n"


dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@EFormTp", Request.ParamGet("EFormTp"));

ODS.TraceQueryState("EForm_query_sc", sql, dbconn);

var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();

