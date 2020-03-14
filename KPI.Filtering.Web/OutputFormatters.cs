using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KPI.Filtering.Web
{
    public static class OutputFormatters
    {
        public static string OutpurDataSource(this OutputDataSource dataSource)
        {
            string constraints = "";
            if(dataSource.Constraints != null && dataSource.Constraints.Count > 0)
            {
                constraints = dataSource.Constraints.OutputConstraints();
            }
            string joins = "";
            if(dataSource.JoinDetails != null && dataSource.JoinDetails.JoinDataSource != null)
            {
                joins = dataSource.JoinDetails.OutputJoins();
            }
            return $"<ds name=\"{dataSource.Name}\">{constraints}{joins}</ds>";
        }

        public static string OutputConstraints(this List<Constraint> constraints)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<constraints>");
            foreach (var item in constraints)
            {
                sb.Append(item.OutputConstraint());
            }
            sb.Append("</constraints>");

            return sb.ToString();
        }

        public static string OutputConstraint(this Constraint constraint)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append($"<{constraint.Operation}>");
            sb.Append($"<attribute name=\"{constraint.Attribute}\" />");
            sb.Append($"<comparator name=\"{constraint.Comparator}\" />");
            sb.Append($"<operand value=\"{constraint.Operand}\" />");
            sb.Append($"</{constraint.Operation}>");
            return sb.ToString();
        }

        public static string OutputJoins(this KPIJoin join)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append($"<join on=\"{join.On}\" operation=\"{join.Operation}\">");
            sb.Append(join.JoinDataSource.OutpurDataSource());
            sb.Append($"</join>");

            return sb.ToString();
        }
    }
}
