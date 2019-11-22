//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

var dbconn = ODS.GetConnection();


var EFormID = Request.ParamGet("EFormID");
var CmpyCd = Request.ParamGet("CmpyCd");


var DataID = Request.ParamGet("DataID");
if ( DataID == "" )
{
	var DataID = 1;
	var sql = "SELECT IFNULL(MAX(DataID), 0) + 1 DataID FROM EFormData \r\n"
	var rset = dbconn.ExecuteReader(sql);
	if ( rset.Read() ) DataID = rset.GetString("DataID");
	rset.Close();
	
	var sql ="INSERT INTO EFormData(DataID, CmpyCd, EFormID \r\n"
	         +"    , DataNm, Remarks, ApUserID \r\n"
	         +"    , ApDt, UpUserID, UpDt) \r\n"
	         +"VALUES(  @DataID, @CmpyCd, @EFormID \r\n"
	         +"    , @DataNm, @Remarks, @ApUserID \r\n"
	         +"    , @ApDt, @UpUserID, @UpDt) \r\n"
}
else
{
	var sql ="UPDATE EFormData SET  \r\n"
	         +" CmpyCd=@CmpyCd, EFormID=@EFormID \r\n"
	         +"    , DataNm=@DataNm, Remarks=@Remarks, UpUserID=@UpUserID, UpDt=@UpDt \r\n"
	         +"WHERE DataID=@DataID \r\n"
}

dbconn.AddParameterInt("@DataID", DataID);
dbconn.AddParameter("@CmpyCd", CmpyCd);
dbconn.AddParameterInt("@EFormID", EFormID);
dbconn.AddParameter("@DataNm", Request.ParamGet("DataNm"));
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EFormData_update_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

Response.SetCellData("DataID", 0, DataID);
if( Request.ParamGetRecord("DataID", 0) == "" )
{
	Response.SetCellData( "ApDt", 0, ApDt );
	Response.SetCellData( "UpDt", 0, ApDt );
}
else
{
	Response.SetCellData( "ApDt", 0, Request.ParamGetRecord("ApDt", 0) );
	Response.SetCellData( "UpDt", 0, ApDt );
}
Response.SetCellData("ApUserID", 0, ApUserID);
Response.SetCellData("UpUserID", 0, ApUserID);

/*----------- detail 저장 -------------*/
//ODS.ShowWarning(Request.SUB_GetCellData("ST01", "save_data", 0));
//ODS.ShowWarning(Request.SUB_GetRecordCount("ST01"));

var sql = "DELETE FROM EFormDataLine WHERE DataID = @DataID \r\n"
dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
var count = dbconn.ExecuteNonQuery(sql);

for( var i = 0 ; i < Request.SUB_GetRecordCount("ST01") ; i++ )
{
	var FieldCd = Request.SUB_GetCellData("ST01", "FieldCd", i);
	var FieldTp = Request.SUB_GetCellData("ST01", "FieldTp", i);
	var RowNo = Request.SUB_GetCellData("ST01", "RowNo", i);
	var FieldVal = Request.SUB_GetCellData("ST01", "FieldVal", i);
	var GridCd = Request.SUB_GetCellData("ST01", "GridCd", i);
	var ImgData = Request.SUB_GetCellData("ST01", "ImgData", i);
	
//		console.log( uid+"/../"+ui_type+"/../"+map_name+"/../"+gid+"/../"+value);
	//ODS.ShowWarning(FieldCd+"/../"+FieldTp+"/../"+RowNo+"/../"+FieldVal+"/../"+GridCd+"\r\n");
	
	
	var LineID = 1;
	var sql = "SELECT IFNULL(MAX(LineID), 0) + 1 LineID FROM EFormDataLine \r\n"
	var rset = dbconn.ExecuteReader(sql);
	if ( rset.Read() ) LineID = rset.GetString("LineID");
	rset.Close();
	
	var sql ="INSERT INTO EFormDataLine(LineID, DataID, EFormID \r\n"
	         +"    , CmpyCd, FieldCd, FieldTp, GridCd \r\n"
	         +"    , RowNo, FieldVal, ImgData \r\n"
	         +"    , ApUserID, ApDt, UpUserID \r\n"
	         +"    , UpDt) \r\n"
	         +"VALUES(  @LineID, @DataID, @EFormID \r\n"
	         +"    , @CmpyCd, @FieldCd, @FieldTp, @GridCd \r\n"
	         +"    , @RowNo, @FieldVal, @ImgData \r\n"
	         +"    , @ApUserID, @ApDt, @UpUserID \r\n"
	         +"    , @UpDt) \r\n"
	         

	dbconn.AddParameterInt("@LineID", LineID);
	dbconn.AddParameterInt("@DataID", DataID);
	dbconn.AddParameterInt("@EFormID", EFormID);
	dbconn.AddParameter("@CmpyCd", CmpyCd);
	dbconn.AddParameter("@FieldCd", FieldCd);
	dbconn.AddParameter("@FieldTp", FieldTp);
	dbconn.AddParameter("@GridCd", GridCd);
	dbconn.AddParameterInt("@RowNo", RowNo);
	dbconn.AddParameter("@FieldVal", FieldVal);
	dbconn.AddParameter("@ImgData", ImgData);
	dbconn.AddParameter("@ApUserID", ApUserID);
	dbconn.AddParameter("@ApDt", ApDt);
	dbconn.AddParameter("@UpUserID", ApUserID);
	dbconn.AddParameter("@UpDt", ApDt);
	
	var count = dbconn.ExecuteNonQuery(sql);

}






