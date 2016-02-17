<?php

namespace Faker\Provider\zh_TW;

class Text extends \Faker\Provider\Text
{
    protected static $separator = '';
    protected static $separatorLen = 0;

    /**
     * All punctuation in $baseText: 、 。 「 」 『 』 ！ ？ ー ， ： ；
     */
    protected static $notEndPunct = array('、', '「', '『', 'ー', '，', '：', '；');
    protected static $endPunct = array('。', '」', '』', '！', '？');
    protected static $notBeginPunct = array('、', '。', '」', '』', '！', '？', 'ー', '，', '：', '；');

    /**
     * Title: 三國演義 Romance of the Three Kingdoms
     * Author: 羅貫中 Luo Guanzhong
     * Language: Chinese
     *
     * @see http://www.gutenberg.org/cache/epub/11/pg11.txt
     * @var string
     */
    protected static $baseText = <<<'EOT'
第一回：宴桃園豪傑三結義，斬黃巾英雄首立功

詞曰：滾滾長江東逝水，浪花淘盡英雄。是非成敗轉頭空：青山依舊在，幾度夕陽紅。白髮漁樵江渚上，慣看秋月春風。一壺濁酒喜相逢：古今多少事，都付笑談中。

話說天下大勢，分久必合，合久必分：周末七國分爭，并入於秦。及秦滅之後，楚、漢分爭，又并入於漢。漢朝自高祖斬白蛇而起義，一統天下。後來光武中興，傳至獻帝，遂分為三國。推其致亂之由，殆始於桓、靈二帝。桓帝禁錮善類，崇信宦官。及桓帝崩，靈帝即位，大將軍竇武、太傅陳蕃，共相輔佐。時有宦官曹節等弄權，竇武、陳蕃謀誅之，作事不密，反為所害。中涓自此愈橫。

建寧二年四月望日，帝御溫德殿。方陞座，殿角狂風驟起，只見一條大青蛇，從梁上飛將下來，蟠於椅上。帝驚倒，左右急救入宮，百官俱奔避。須臾，蛇不見了。忽然大雷大雨，加以冰雹，落到半夜方止，壞卻房屋無數。建寧四年二月，洛陽地震；又海水泛溢，沿海居民，盡被大浪捲入海中。光和元年，雌雞化雄。六月朔，黑氣十餘丈，飛入溫德殿中。秋七月，有虹見於玉堂；五原山岸，盡皆崩裂。種種不祥，非止一端。

帝下詔問群臣以災異之由，議郎蔡邕上疏，以為蜺墮雞化，乃婦寺干政之所致，言頗切直。帝覽奏歎息，因起更衣。曹節在後竊視，悉宣告左右，遂以他事陷邕於罪，放歸田里。後張讓，趙忠，封諝，段珪，曹節，候覽，蹇碩，程曠，夏惲，郭勝十人朋比為奸，號為「十常侍」。帝尊信張讓，呼為「阿父」，朝政日非，以致天下人心思亂，盜賊蜂起。

時鉅鹿郡有兄弟三人：一名張角，一名張寶，一名張梁。那張角本是個不第秀才。因入山採藥，遇一老人，碧眼童顏，手執藜杖，喚角至一洞中，以天書三卷授之，曰：「此名太平要術。汝得之，當代天宣化，普救世人；若萌異心，必獲惡報。」角拜問姓名。老人曰：「吾乃南華老仙也。」言訖，化陣清風而去。

角得此書，曉夜攻習，能呼風喚雨，號為太平道人。中平元年正月內，疫氣流行，張角散施符水，為人治病，自稱大賢良師。角有徒弟五百餘人，雲游四方，皆能書符念咒。次後徒眾日多，角乃立三十六方，ー大方萬餘人，小方六七千ー，各立渠帥，稱為將軍。訛言「蒼天已死，黃天當立。」又云「歲在甲子，天下大吉。」令人各以白土，書「甲子」二字於家中大門上。青、幽、徐、冀、荊、揚、兗、豫八州之人，家家侍奉大賢良師張角名字。角遣其黨馬元義，暗齎金帛，結交中涓封諝，以為內應。角與二弟商議曰：「至難得者，民心也。今民心已順，若不乘勢取天下，誠為可惜。」遂一面私造黃旗，約期舉事；一面使弟子唐州，馳書報封諝。唐州乃逕赴省中告變。帝召大將軍何進調兵擒馬元義，斬之；次收封諝等一干人下獄。

張角聞知事露，星夜舉兵，自稱天公將軍，ー張寶稱地公將軍，張梁稱人公將軍ー。申言於眾曰：「今漢運將終，大聖人出；汝等皆宜順從天意，以槳太平。」四方百姓，裹黃巾從張角反者，四五十萬。賊勢浩大，官軍望風而靡。何進奏帝火速降詔，令各處備禦，討賊立功；一面遣中郎將盧植，皇甫嵩，朱雋，各引精兵，分三路討之。

且說張角一軍，前犯幽州界分。幽州太守劉焉，乃江夏竟陵人氏，漢魯恭王之後也；當時聞得賊兵將至，召校尉鄒靖計議。靖曰：「賊兵眾，我兵寡，明公宜作速招軍應敵。」劉焉然其說，隨即出榜招募義兵。榜文行到涿縣，乃引出涿縣中一個英雄。

那人不甚好讀書；性寬和，寡言語，喜怒不形於色；素有大志，專好結交天下豪傑；生得身長七尺五寸，兩耳垂肩，雙手過膝，目能自顧其耳，面如冠玉，脣若塗脂；中山靖王劉勝之後，漢景帝閣下玄孫；姓劉，名備，字玄德。昔劉勝之子劉貞，漢武時封涿鹿亭侯，後坐酬金失侯，因此遺這一枝在涿縣。玄德祖劉雄，父劉弘。弘曾舉孝廉，亦嘗作吏，早喪。玄德幼孤，事母至孝；家貧，販屨織蓆為業。家住本縣樓桑村。其家之東南，有一大桑樹，高五丈餘，遙望之，童童如車蓋。相者云：「此家必出貴人。」

玄德幼時，與鄉中小兒戲於樹下，曰：「我為天子，當乘此車蓋。」叔父劉元起奇其言，曰：「此兒非常人也！」因見玄德家貧，常資給之。年十五歲，母使游學，嘗師事鄭玄、盧植；與公孫瓚等為友。及劉焉發榜招軍時，玄德年己二十八歲矣。當日見了榜文，慨然長歎。隨後一人厲聲言曰：「大丈夫不與國家出力，何故長歎？」

玄德回視其人：身長八尺，豹頭環眼，燕頷虎鬚，聲若巨雷，勢如奔馬。玄德見他形貌異常，問其姓名。其人曰：「某姓張，名飛，字翼德。世居涿郡，頗有莊田，賣酒屠豬，專好結交天下豪傑。適纔見公看榜而歎，故此相問。」玄德曰：「我本漢室宗親，姓劉，名備。今聞黃巾倡亂，有志欲破賊安民；恨力不能，故長歎耳。」飛曰：「吾頗有資財，當招募鄉勇，與公同舉大事，如何？」玄德甚喜，遂與同入村店中飲酒。

正飲間，見一大漢，推著一輛車子，到店門首歇了；入店坐下，便喚酒保：「快斟酒來吃，我待趕入城去投軍。」玄德看其人：身長九尺，髯長二尺：面如重棗，脣若塗脂；丹鳳眼，臥蠶眉：相貌堂堂，威風凜凜。玄德就邀他同坐，叩其姓名。其人曰：「吾姓關，名羽，字壽長，後改雲長，河東解良人也。因本處勢豪，倚勢凌人，被吾殺了；逃難江湖，五六年矣。今聞此處招軍破賊，特來應募。」玄德遂以己志告之。雲長大喜。同到張飛莊上，共議大事。

飛曰：「吾莊後有一桃園，花開正盛；明日當於園中祭告天地，我三人結為兄弟，協力同心，然後可圖大事。」玄德、雲長、齊聲應曰：「如此甚好。」次日，於桃園中，備下烏牛白馬祭禮等項，三人焚香，再拜而說誓曰：「念劉備、關羽、張飛，雖然異姓，既結為兄弟，則同心協力，救困扶危；上報國家，下安黎庶；不求同年同月同日生，但願同年同月同日死。皇天后土，實鑒此心。背義忘恩，天人共戮。」誓畢，拜玄德為兄，關羽次之，張飛為弟。祭罷天地，復宰牛設酒，聚鄉中勇士，得三百餘人，就桃園中痛飲一醉。來日收拾軍器，但恨無馬匹可乘。

正思慮間，人報「有兩個客人，引一夥伴儅，趕一群馬，投莊上來。」玄德曰：「此天佑我也！」三人出莊迎接。原來二客乃中山大商：一名張世平，一名蘇雙，每年往北販馬，近因寇發而回。玄德請二人到莊，置酒管待，訴說欲討賊安民之意。二客大喜，願將良馬五十匹相送；又贈金銀五百兩，鑌鐵一千斤，以資器用。玄德謝別二客，便命良匠打造雙股劍。雲長造青龍偃月刀，又名冷豔鋸，重八十二斤。張飛造丈八點鋼矛。各置全身鎧甲。共聚鄉勇五百餘人，來見鄒靖。鄒靖引見太守劉焉。三人參見畢，各通姓名。玄德說起宗派，劉焉大喜，遂認玄德為姪。

不數日，人報黃巾賊將程遠志統兵五萬來犯涿郡。劉焉令鄒靖引玄德等三人，統兵五百，前去破敵。玄德等欣然領軍前進，直至大興山下，與賊相見。賊眾皆披髮，以黃巾抹額。當下兩軍相對，玄德出馬，ー左有雲長，右有翼德ー，揚鞭大罵：「反國逆賊，何不早降！」

程遠志大怒，遣副將鄧茂出戰。張飛挺丈八蛇矛直出，手起處，刺中鄧茂心窩，翻身落馬。程遠志見折了鄧茂，拍馬舞刀，直取張飛。雲長舞動大刀，縱馬飛迎。程遠志見了，早吃一驚；措手不及，被雲長刀起處，揮為兩段。後人有詩讚二人曰：

英雄發穎在今朝，一試矛兮一試刀。初出便將威力展，三分好把姓名標。

眾賊見程遠志被斬，皆倒戈而走。玄德揮軍追趕，投降者不計其數，大勝而回。劉焉親自迎接，賞勞軍士。次日，接得青州太守龔景牒文，言黃巾賊圍城將陷，乞賜救援。劉焉與玄德商議。玄德曰：「備願往救之。」劉焉令鄒靖將兵五千，同玄德，關，張，投青州來。賊眾見救軍至，分兵混戰。玄德兵寡不勝，退三十里下寨。玄德謂關、張曰、「賊眾我寡，必出奇兵，方可取勝。」乃分關公引一千軍伏山左，張飛引一千軍伏山右，鳴金為號，齊出接應。

次日，玄德與鄒靖，引軍鼓譟而進。賊眾迎戰，玄德引軍便退。賊眾乘勢追趕，方過山嶺，玄德軍中一齊鳴金，左右兩軍齊出，玄德麾軍回身復殺。三路夾攻，賊眾大潰。直趕至青州城下，太守龔景亦率民兵出城助戰。賊勢大敗，剿戮極多，遂解青州之圍。後人有詩讚玄德曰：

運籌決算有神功，二虎還須遜一龍。初出便能垂偉績，自應分鼎在孤窮。

龔景犒軍畢，鄒靖欲回。玄德曰：「近聞中郎將盧植與賊首張角戰於廣宗，備昔曾師事盧植，欲往助之。」於是鄒靖引軍自回，玄德與關、張引本部五百人投廣宗來。至盧植軍中，入帳施禮，具道來意。盧植大喜，留在帳前聽調。

時張角賊眾十五萬，植兵五萬，相拒於廣宗，未見勝負。植謂玄德曰：「我今圍賊在此，賊弟張梁，張寶在潁川，與皇甫嵩、朱雋對壘。汝可引本部人馬，我更助汝一千官軍，前去潁川打探消息，約期剿捕。」玄德領命，引軍星夜投潁川來。時皇甫嵩、朱雋領軍拒賊，賊戰不利，退入長社，依草結營。嵩與雋計曰：「賊依草結營，當用火攻之。」遂令軍士，每人束草一把，暗地埋伏。其夜大風忽起。二更以後，一齊縱火，嵩與雋各引兵攻擊賊寨，火燄張天，賊眾驚慌，馬不及鞍，人不及甲，四散奔走。殺到天明，張梁、張寶引敗殘軍士，奪路而走。

忽見一彪軍馬，盡打紅旗，當頭來到，截往去路。為首閃出一將，身長七尺，細眼長髯；官拜騎都尉；沛國譙郡人也：姓曹，名操，字孟德。操父曹嵩，本姓夏侯氏；因為中常侍曹騰之養子，故冒姓曹。曹嵩生操，小字阿瞞，一名吉利。操幼時，好游獵，喜歌舞；有權謀，多機變。操有叔父，見操游蕩無度，嘗怒之，言於曹嵩。嵩責操。操忽心生一計：見叔父來，詐倒於地，作中風之狀。叔父驚告嵩，嵩急視之，操故無恙。嵩曰：「叔言汝中風，今己愈乎？」操曰：「兒自來無此病；因失愛於叔父，故見罔耳。」嵩信其言。後叔父但言操過，嵩並不聽。因此，操得恣意放蕩。

時人有橋玄者，謂操曰：「天下將亂，非命世之才，不能濟。能安之者，其在君乎？」南陽何顒見操，言：「漢室將亡，安天下者，必此人也。」汝南許劭，有知人之名。操往見之，問曰：「我何如人？」劭不答。又問，劭曰：「子治世之能臣，亂世之奸雄也。」操聞言大喜。年二十，舉孝廉，為郎，除洛陽北都尉。初到任，即設五色棒十餘條於縣之四門。有犯禁者，不避豪貴，皆責之。中常侍蹇碩之叔，提刀夜行，操巡夜拏住，就棒責之。由是，內外莫敢犯者，威名頗震。後為頓丘令。因黃巾起，拜為騎都尉，引馬步軍五千，前來潁川助戰。正值張梁、張寶敗走，曹操攔住，大殺一陣，斬首萬餘級，奪得旗旛、金鼓馬匹極多。張梁、張寶死戰得脫。操見過皇甫嵩，朱雋，隨即引兵追襲張梁、張寶去了。

卻說玄德引關、張來潁川，聽得喊殺之聲，又望見火光燭天，急引兵來時，賊已敗散。玄德見皇甫嵩，朱雋，其道盧植之意。嵩曰：「張梁、張寶勢窮力乏，必投廣宗去依張角。玄德可即星夜往助。」

玄德領命，遂引兵復回。到得半路，只見一簇軍馬，護送一輛檻車，車中之囚，乃盧植也。玄德大驚，滾鞍下馬，問其緣故。植曰：「我圍張角，將次可破；因角用妖術，未能即勝。朝廷差黃門左豐前來體探，問我索取賄賂。我答曰：『軍糧尚缺，安有餘錢奉承天使？』左豐挾恨，回奏朝廷，說我高壘不戰，惰慢軍心；因此朝廷震怒，遣中郎將董卓來代將我兵，取我回京問罪。」

張飛聽罷，大怒，要斬護送軍人，以救盧植。玄德急止之曰：「朝廷自有公論，汝豈可造次？」軍士簇擁盧植去了。關公曰：「盧中郎已被逮，別人領兵，我等去無所依，不如且回涿郡。」玄德從其言，遂引軍北行。

行無二日，忽聞山後喊聲大震。玄德引關、張縱馬上高岡望之，見漢軍大敗，後面漫山塞野，黃巾蓋地而來，旗上大書「天公將軍」。玄德曰：「此張角也！可速戰！」

三人飛馬引軍而出。張角正殺敗董卓，乘勢趕來，忽遇三人衝殺，角軍大亂，敗走五十餘里。三人救了董卓回寨。卓問三人現居何職。玄德曰：「白身。」卓甚輕之，不為禮。玄德出，張飛大怒曰：「我等親赴血戰，救了這廝，他卻如此無禮；若不殺之，難消我氣！」便要提刀入帳來殺董卓。正是：人情勢利古猶今，誰識英雄是白身？安得快人如翼德，盡誅世上負心人！畢竟董卓性命如何，且看下文分解。
EOT;

    protected static function explode($text)
    {
        $chars = array();
        foreach (preg_split('//u', preg_replace('/\s+/', '', $text)) as $char) {
            if ($char !== '') {
                $chars[] = $char;
            }
        }
        return $chars;
    }

    protected static function strlen($text)
    {
        return function_exists('mb_strlen') ? mb_strlen($text, 'UTF-8') : count(static::explode($text));
    }

    protected static function validStart($word)
    {
        return !in_array($word, static::$notBeginPunct);
    }

    protected static function appendEnd($text)
    {
        // extract the last char of $text
        if (function_exists('mb_substr')) {
            $last = mb_substr($text, mb_strlen($text)-1, null, 'UTF-8');
        } else {
            $chars = static::split($text);
            $last = end($chars);
        }
        // if the last char is a not-valid-end punctuation, remove it
        if (in_array($last, static::$notEndPunct)) {
            $text = preg_replace('/.$/u', '', $text);
        }
        // if the last char is not a valid punctuation, append a default one.
        return in_array($last, static::$endPunct) ? $text : $text.'。';
    }
}
