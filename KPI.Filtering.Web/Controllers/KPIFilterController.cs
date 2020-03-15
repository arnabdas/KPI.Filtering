using ExcelDataReader;
using KPI.Filtering.Web.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Xml;

namespace KPI.Filtering.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KPIFilterController : ControllerBase
    {
        [HttpPost("ProcessInput")]
        public ActionResult<List<KPIDataSource>> ProcessInput([FromForm]KPIInput input)
        {
            using (var stream = input.KPIInputExcel.OpenReadStream())
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var result = reader.AsDataSet();
                List<KPIDataSource> kpiDataSources = new List<KPIDataSource>();
                foreach (DataTable table in result.Tables)
                {
                    string dsName = "";
                    List<int> enumToLookFor = new List<int>();
                    KPIDataSource kpiDataSource = new KPIDataSource();
                    try
                    {
                        dsName = table.Rows[0].ItemArray[0].ToString();
                        if (dsName.EndsWith("Table", StringComparison.InvariantCultureIgnoreCase))
                        {
                            dsName = dsName.Substring(0,
                                dsName.LastIndexOf("Table", StringComparison.InvariantCultureIgnoreCase)).Trim();
                            //colNum = int.Parse(table.Rows[0].ItemArray[1].ToString());
                            kpiDataSource.Name = dsName;
                            // process headers
                            for (int col = 0; col < table.Rows[1].ItemArray.Length; col++)
                            {
                                string label = table.Rows[1].ItemArray[col].ToString();
                                if (string.IsNullOrEmpty(label))
                                {
                                    continue;
                                }
                                ColumnDetails colDetails = new ColumnDetails();
                                kpiDataSource.Columns.Add(colDetails);
                                if (label.EndsWith("List"))
                                {
                                    colDetails.IsEnumeration = true;
                                    colDetails.Label = label.Substring(0,
                                        label.LastIndexOf("List", StringComparison.InvariantCultureIgnoreCase)).Trim();
                                    enumToLookFor.Add(col);
                                }
                                else
                                {
                                    colDetails.Label = label;
                                }
                            }
                            kpiDataSources.Add(kpiDataSource);
                            if (table.Rows.Count < 3)
                            {
                                continue;
                            }
                            // process data
                            for (int dataRowIndex = 2; dataRowIndex < table.Rows.Count; dataRowIndex++)
                            {
                                for (int dataCol = 0; dataCol < table.Rows[dataRowIndex].ItemArray.Length; dataCol++)
                                {
                                    if (enumToLookFor.IndexOf(dataCol) > -1)
                                    {
                                        kpiDataSource.Columns[dataCol].Enumeration.Add(
                                            table.Rows[dataRowIndex].ItemArray[dataCol].ToString());
                                    }
                                }
                            }
                            foreach (var enumCol in enumToLookFor)
                            {
                                kpiDataSource.Columns[enumCol].Enumeration =
                                    kpiDataSource.Columns[enumCol].Enumeration.Distinct().ToList();
                            }
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                return kpiDataSources;
            }
        }

        [HttpPost("ProcessFilterConditions")]
        public ActionResult ProcessFilterConditions([FromBody]OutputDataSource outputDataSource)
        {
            return Content(outputDataSource.OutpurDataSource(), "application/xml");
        }

        [HttpPost("ExportFilterConditions")]
        public IActionResult ExportFilterConditions([FromBody]OutputDataSource outputDataSource)
        {
            try
            {
                XmlDocument resultXml = new XmlDocument();
                resultXml.LoadXml(outputDataSource.OutpurDataSource());
                MemoryStream xmlStream = new MemoryStream();
                resultXml.Save(xmlStream);
                xmlStream.Flush();
                xmlStream.Position = 0;
                return new FileStreamResult(xmlStream, "application/xhtml+xml")
                {
                    FileDownloadName = "KPIFilters.xml"
                };
                //return File(xmlStream, "application/octet-stream");
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}