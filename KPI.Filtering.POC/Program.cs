using ExcelDataReader;
using KPI.Filtering.POC.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;

namespace KPI.Filtering.POC
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            Console.WriteLine("Hello World!");

            string excelLocation = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "TestData.xlsx");
            using (var stream = File.Open(excelLocation, FileMode.Open, FileAccess.Read))
            // Auto-detect format, supports:
            //  - Binary Excel files (2.0-2003 format; *.xls)
            //  - OpenXml Excel files (2007 format; *.xlsx)
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                // Choose one of either 1 or 2:

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
                                if(string.IsNullOrEmpty(label))
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
                            for(int dataRowIndex = 2; dataRowIndex < table.Rows.Count; dataRowIndex++)
                            {
                                for (int dataCol = 0; dataCol < table.Rows[dataRowIndex].ItemArray.Length; dataCol++)
                                {
                                    if(enumToLookFor.IndexOf(dataCol) > -1)
                                    {
                                        kpiDataSource.Columns[dataCol].Enumeration.Add(
                                            table.Rows[dataRowIndex].ItemArray[dataCol].ToString());
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
        }
    }
}
