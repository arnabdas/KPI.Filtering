using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace KPI.Filtering.Web.Models
{
    public class KPIInput
    {
        public IFormFile KPIInputExcel { get; set; }
    }
}
