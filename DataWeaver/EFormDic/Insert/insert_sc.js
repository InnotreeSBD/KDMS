//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

var dbconn = ODS.GetConnection();


//------- DicID, DicCd, DispSeq 채번 ----------
var DicID = 1;
var DispSeq = 1;
var sql = "SELECT IFNULL(MAX(DicID), 0) + 1 DicID FROM EFormDic \r\n"
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) DicID = rset.GetString("DicID");
rset.Close();

sql = "SELECT IFNULL(MAX(DispSeq), 0) + 1 DispSeq FROM EFormDic WHERE ParentID = @ParentID \r\n"
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) DispSeq = rset.GetString("DispSeq");
rset.Close();

var DicCd = "000000000000";
//<% sql
SELECT CASE 
		 WHEN MAX(DicCd) IS NULL THEN CONCAT ( CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ),'0001')  
		 WHEN SUBSTRING(MAX(DicCd), 1, 8)  = CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ) THEN MAX(DicCd)+1 
		 WHEN SUBSTRING(MAX(DicCd), 1, 8) <> CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ) THEN CONCAT (CAST( DATE_FORMAT( NOW(),'%Y%m%d' ) AS CHAR(8) ), '0001') 
		 END DicCd 
  FROM EFormDic
//%>
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) DicCd = rset.GetString("DicCd");
rset.Close();

var sql ="INSERT INTO EFormDic(DicID, DicCd, CmpyCd \r\n"
         +"    , DicNm, DicXML, MapSQL \r\n"
         +"    , CatCd1, CatCd2, ParentID \r\n"
         +"    , Lv, DispSeq, Remarks \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt) \r\n"
         +"VALUES(  @DicID, @DicCd, @CmpyCd \r\n"
         +"    , @DicNm, @DicXML, @MapSQL \r\n"
         +"    , @CatCd1, @CatCd2, @ParentID \r\n"
         +"    , @Lv, @DispSeq, @Remarks \r\n"
         +"    , @ApUserID, @ApDt, @UpUserID \r\n"
         +"    , @UpDt) \r\n"


dbconn.AddParameterInt("@DicID", DicID);
dbconn.AddParameter("@DicCd", DicCd);
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@DicNm", Request.ParamGet("DicNm"));
dbconn.AddParameter("@DicXML", Request.ParamGet("DicXML"));
dbconn.AddParameter("@MapSQL", Request.ParamGet("MapSQL"));
dbconn.AddParameter("@CatCd1", Request.ParamGet("CatCd1"));
dbconn.AddParameter("@CatCd2", Request.ParamGet("CatCd2"));
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
dbconn.AddParameterInt("@Lv", Request.ParamGet("Lv"));
dbconn.AddParameterInt("@DispSeq", DispSeq);
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);

ODS.TraceQueryState("EFormDic_insert_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


Response.SetCellData("DicID", 0, DicID);
Response.SetCellData("DispSeq", 0, DispSeq);
Response.SetCellData("DicCd", 0, DicCd);