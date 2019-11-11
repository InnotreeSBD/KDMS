
// 피벗 선택시 그리드 가 포함되어있는지에 대한 결과도 보냄
// 우선 EFormField의 grid_column 유무로 Form / Grid 판단

var dbconn = ODS.GetConnection();

//<% sql 

SELECT a.EFormID, a.EFormCd, a.CmpyCd
    , a.EFormNm, a.EFormTp -- , a.EFormXML, a.MapSQL
    , a.CatCd1, a.CatCd2, a.ParentID
    , a.Lv, a.DispSeq, a.Remarks
    , a.DicID, a.CallType
    , CASE WHEN b.cnt > 0 THEN '1' ELSE '0' END GRID_YN
  FROM EForm a LEFT OUTER JOIN (SELECT EFormID, COUNT(*) cnt FROM EFormField WHERE FieldTp = 'grid_column' GROUP BY EFormID) b ON b.EFormID = a.EFormID
 WHERE 1=1 

//%>

if ( Request.ParamGet("EFormID") != "" ) sql =sql+"   AND EFormID = @EFormID \r\n"
if ( Request.ParamGet("CmpyCd") != "" ) sql =sql+"   AND CmpyCd = @CmpyCd \r\n"
if ( Request.ParamGet("Lv") != "" ) sql =sql+"   AND Lv = @Lv \r\n"

sql =sql+" ORDER BY Lv, ParentID, DispSeq \r\n";


dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@EFormTp", Request.ParamGet("EFormTp"));
dbconn.AddParameterInt("@Lv", Request.ParamGet("Lv"));

ODS.TraceQueryState("EForm_query_rn", sql, dbconn);

var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


