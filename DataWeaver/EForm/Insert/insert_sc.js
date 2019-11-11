//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

var dbconn = ODS.GetConnection();


//------- EFormID, EFormCd, DispSeq 채번 ----------
var EFormID = 1;
var DispSeq = 1;
var sql = "SELECT IFNULL(MAX(EFormID), 0) + 1 EFormID FROM EForm \r\n"
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) EFormID = rset.GetString("EFormID");
rset.Close();

sql = "SELECT IFNULL(MAX(DispSeq), 0) + 1 DispSeq FROM EForm WHERE ParentID = @ParentID \r\n"
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) DispSeq = rset.GetString("DispSeq");
rset.Close();

var EFormCd = "000000000000";
//<% sql

SELECT CASE 
		 WHEN MAX(EFormCd) IS NULL THEN CONCAT ( CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ),'0001')  
		 WHEN SUBSTRING(MAX(EFormCd), 1, 8)  = CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ) THEN MAX(EFormCd)+1 
		 WHEN SUBSTRING(MAX(EFormCd), 1, 8) <> CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ) THEN CONCAT (CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ), '0001') 
		 END EFormCd 
  FROM EForm
//%>
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) EFormCd = rset.GetString("EFormCd");
rset.Close();


sql ="INSERT INTO EForm(EFormID, EFormCd, CmpyCd \r\n"
         +"    , EFormNm, EFormTp, EFormXML, MapSQL \r\n"
         +"    , CatCd1, CatCd2, ParentID \r\n"
         +"    , Lv, DispSeq, Remarks \r\n"
         +"    , DicID, CallType, ApUserID \r\n"
         +"    , ApDt, UpUserID, UpDt) \r\n"
         +"VALUES(  @EFormID, @EFormCd, @CmpyCd \r\n"
         +"    , @EFormNm, @EFormTp, @EFormXML, @MapSQL \r\n"
         +"    , @CatCd1, @CatCd2, @ParentID \r\n"
         +"    , @Lv, @DispSeq, @Remarks \r\n"
         +"    , @DicID, @CallType, @ApUserID \r\n"
         +"    , @ApDt, @UpUserID, @UpDt) \r\n"


dbconn.AddParameterInt("@EFormID", EFormID);
dbconn.AddParameter("@EFormCd", EFormCd);
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@EFormNm", Request.ParamGet("EFormNm"));
dbconn.AddParameter("@EFormTp", Request.ParamGet("EFormTp"));
dbconn.AddParameter("@EFormXML", Request.ParamGet("EFormXML"));
dbconn.AddParameter("@MapSQL", Request.ParamGet("MapSQL"));
dbconn.AddParameter("@CatCd1", Request.ParamGet("CatCd1"));
dbconn.AddParameter("@CatCd2", Request.ParamGet("CatCd2"));
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
dbconn.AddParameterInt("@Lv", Request.ParamGet("Lv"));
dbconn.AddParameterInt("@DispSeq", DispSeq);
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));
dbconn.AddParameter("@CallType", Request.ParamGet("CallType"));
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EForm_insert_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

Response.SetCellData("EFormID", 0, EFormID);
Response.SetCellData("DispSeq", 0, DispSeq);
Response.SetCellData("EFormCd", 0, EFormCd);