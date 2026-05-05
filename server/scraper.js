const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Сөздер (қазақша -> орысша)
const words = {
    'сәлем': 'привет',
    'қалайсың': 'как дела',
    'нестеп жатырсың': 'как дела',
    'пока': 'пока'
};

const baseUrl = 'https://spreadthesign.com/ru.ru/search/?cls=2&q=';
const outputFile = path.join(__dirname, 'video_links.json');

async function getVideoLinks(searchWord, kazakhWord) {
    const url = baseUrl + encodeURIComponent(searchWord);
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const videoUrls = [];
        
        // Барлық video тегтерін іздеу
        $('video').each((i, video) => {
            let src = $(video).attr('src');
            
            // Немесе source тегінен табу
            if (!src) {
                src = $(video).find('source').attr('src');
            }
            
            if (src && src.trim()) {
                // Толық URL құру
                if (src.startsWith('/')) {
                    src = 'https://spreadthesign.com' + src;
                }
                
                if (!videoUrls.includes(src)) {
                    videoUrls.push(src);
                }
            }
        });
        
        return {
            kazakh: kazakhWord,
            russian: searchWord,
            links: videoUrls,
            count: videoUrls.length
        };
        
    } catch (error) {
        return {
            kazakh: kazakhWord,
            russian: searchWord,
            links: [],
            count: 0,
            error: error.message
        };
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('ВИДЕО СІЛТЕМЕЛЕРІН ІЗДЕУ');
    console.log('='.repeat(60));
    
    const results = [];
    
    for (const [kazakh, russian] of Object.entries(words)) {
        console.log(`\n📹 ${kazakh} (${russian})`);
        console.log('-'.repeat(40));
        
        const result = await getVideoLinks(russian, kazakh);
        results.push(result);
        
        if (result.count > 0) {
            result.links.forEach((link, i) => {
                console.log(`${i+1}. ${link}`);
            });
        } else {
            console.log('Видео табылмады');
            if (result.error) {
                console.log(`Қате: ${result.error}`);
            }
        }
        
        // Серверге жүктеме түсірмеу үшін күте ту
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // JSON файлға сақтау
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ САҚТАЛДЫ!');
    console.log(`📁 Файл: ${outputFile}`);
    console.log('='.repeat(60));
    
    // Барлық сілтемелерді бір жерге жинау
    const allLinks = [];
    results.forEach(r => {
        allLinks.push(...r.links);
    });
    
    if (allLinks.length > 0) {
        console.log('\n🎬 БАРЛЫҚ ВИДЕО СІЛТЕМЕЛЕРІ:');
        allLinks.forEach((link, i) => {
            console.log(`${i+1}. ${link}`);
        });
    }
}

main().catch(console.error);
