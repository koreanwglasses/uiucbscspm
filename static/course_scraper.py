from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import re
import urllib
import time
import csv
courses_identifier = ['CS', 'MATH', 'STAT', 'ASRM', 'ECE', 'IS', 'INFO', 'MACS', 'CSE', 'LING', 'PHIL', 'ADV', 'IE', 'IS', 'PSYC', 'ANTH', 'EPSY', ]

# create a webdriver object and set options for headless browsing
options = Options()
options.headless = True
driver = webdriver.Chrome('C:/Users/shenq/AppData/Local/Microsoft/WindowsApps/chromedriver.exe', options=options)

# uses webdriver object to execute javascript code and get dynamically loaded webcontent


def get_js_soup(url, driver):
    driver.get(url)
    res_html = driver.execute_script('return document.body.innerHTML')
    soup = BeautifulSoup(res_html,'html.parser') # beautiful soup object to be used for parsing html content
    return soup

# tidies extracted text



''' More tidying
Sometimes the text extracted HTML webpage may contain javascript code and some style elements. 
This function removes script and style tags from HTML so that extracted text does not contain them.
'''

def remove_script(soup):
    for script in soup(["script", "style", "href"]):
        script.decompose()
    return soup




courses_url = 'http://catalog.illinois.edu/courses-of-instruction/cs/'


def scrape_course(courses_url, driver):  # This function return a list of all the urls to the content of each massmail
    # print('-' * 20, 'Scraping course page', '-' * 20)
    term_links = []
    soup = get_js_soup(courses_url, driver)
    for link_holder in soup.find_all('p', class_='courseblocktitle'):
        content_link = link_holder.find('a', class_='schedlink')['href']
        term_links.append(content_link)
    # print('-' * 20, 'Found {} courses'.format(len(term_links)), '-' * 20)
    return term_links


termlinks = scrape_course(courses_url, driver)

# This function return a list of what terms the course has offered
def scrape_term_offered(termlink, driver):
    terms = []
    soup = get_js_soup(termlink, driver)

    # Getting the semester
    for listing in soup.find_all('li'):
        content = listing.find('a')
        soup = BeautifulSoup(str(content), "html.parser")
        term_and_year = soup.get_text()
        if len(term_and_year)>4:
            temp = term_and_year.split('\n')
            if len(temp) == 3 :
                index = len(temp[1].split(' '))-2
                terms.append(temp[1].split(' ')[index])
    terms = list(dict.fromkeys(terms))

    # Adding the course name to the front of the list
    link_components = str(termlink).split('/')
    name_index = len(link_components)-1
    course_name = link_components[name_index-1] + link_components[name_index]
    terms.insert(0, course_name)
    # print(terms)
    return terms
'''
# Writing to csv file, uncomment them when need to rewrite
writer = csv.writer(open("terms.csv", "w", newline=''))
for link in termlinks:
    writer.writerow(scrape_term_offered(link, driver))
'''

def scrape_info(courses_url, driver):
    info = []

    soup = get_js_soup(courses_url, driver)

    for course in soup.find_all('div', class_='courseblock'):
        info_each_course = []
        # Get course name
        title = course.find('p', class_='courseblocktitle').find('a', class_='schedlink')
        soup1 = BeautifulSoup(str(title), "html.parser")
        title_cleaned = str(soup1.get_text()).split()

        # Record the course name
        info_each_course.append(title_cleaned[0]+title_cleaned[1])
        credit_index = title_cleaned.index('credit:')

        # Get course title (to be added in the description)
        info_each_course.append('')
        for i in range(2, credit_index):
            info_each_course[1] = info_each_course[1]+title_cleaned[i]+' '
        info_each_course[1] = info_each_course[1].rstrip()

        description = course.find('p', class_='courseblockdesc')
        soup2 = BeautifulSoup(str(description), "html.parser")
        desc_cleaned = soup2.get_text().replace(u'\xa0', u' ')
        info_each_course[1] = info_each_course[1] + "\n" + str(desc_cleaned)

        # Process the description for prerequisite
        prerequisites = []
        bow = desc_cleaned.split()
        try:
            pre_index = bow.index('Prerequisite:')
            pre = True
        except ValueError:
            pre = False

        if pre:
            for z in range(pre_index, len(bow)):
                if bow[z] in courses_identifier:
                    prerequisites.append(
                        bow[z] + bow[z + 1].strip('.').strip(';').strip(',').strip('.This').strip('/STA'))
        info_each_course.append(prerequisites)

        # Get credit
        if title_cleaned[credit_index+2] == 'Hours.' or title_cleaned[credit_index+2] == 'Hour.':
            info_each_course.append(title_cleaned[credit_index+1])  # Get the credit
            info_each_course.insert(0, info_each_course[0]+'_'+info_each_course[3])  # Add the course id
            info.append(info_each_course)
        elif title_cleaned[credit_index+2] == 'or':
            the_other_credit = info_each_course.copy()
            info_each_course.append(title_cleaned[credit_index + 1])  # Get the credit
            info_each_course.insert(0, info_each_course[0] + '_' + info_each_course[3])  # Add the course id
            info.append(info_each_course)
            the_other_credit.append(title_cleaned[credit_index + 3])  # Get the credit
            the_other_credit.insert(0, the_other_credit[0] + '_' + the_other_credit[3])  # Add the course id
            info.append(the_other_credit)
        elif title_cleaned[credit_index+2] == 'to':
            for j in range(int(title_cleaned[credit_index+1]), int(title_cleaned[credit_index+3])+1):
                the_credit = info_each_course.copy()
                the_credit.append(j)
                the_credit.insert(0, the_credit[0] + '_' + str(j))
                info.append(the_credit)
    return info


infos = scrape_info(courses_url, driver)

# Writing to csv file, uncomment them when need to rewrite
writer = csv.writer(open("info.csv", "w", newline=''))
for info in infos:
    writer.writerow(info)
    print('writing')

'''
# Scrape each content url and write the content to a csv file
# Each row is one massmail, each column is one paragraph
def scrape_content(content_url, driver):
    content = []

    soup = get_js_soup(content_url, driver)
    
    for paragraph in soup.find_all('p'):
        content.append(str(paragraph))

    return content





writer = csv.writer(open("massmails.csv", "w", newline=''))

print('writing', end='')
for link in contentlinks:
    print('-', end='')
    writer.writerow(scrape_content(link, driver))
    #print(scrape_content(link, driver)) 
'''